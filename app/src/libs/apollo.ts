import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { setContext } from "@apollo/client/link/context"
import { API_URL } from "./keys"
import { authToken } from "store/authStore"

export async function apolloSetup(signOut: () => void) {
    const errorLink = onError(({ graphQLErrors }) => {
        if (graphQLErrors) {
            const err = graphQLErrors[0].message
            if (err === "Unauthenticated") {
                console.log(err)
                signOut()
            }
        }
    })
    const networkLink = createHttpLink({
        uri: `${API_URL}/graphql`,
    })
    const authLink = setContext(async (_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = authToken()

        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            },
        }
    })

    const client = new ApolloClient({
        link: from([errorLink, authLink, networkLink]),
        cache: new InMemoryCache(),
    })

    return { client }
}
