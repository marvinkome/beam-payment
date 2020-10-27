import AsyncStorage from "@react-native-async-storage/async-storage"
import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { setContext } from "@apollo/client/link/context"
import { API_URL, AUTH_TOKEN } from "./keys"
import { navigate } from "./navigator"

export async function apolloSetup() {
    const errorLink = onError(({ graphQLErrors }) => {
        if (graphQLErrors) {
            const err = graphQLErrors[0].message
            if (err === "Unauthenticated") {
                AsyncStorage.removeItem(AUTH_TOKEN).then(() => {
                    navigate("SignUp")
                })
            }
        }
    })
    const networkLink = createHttpLink({
        uri: `${API_URL}/graphql`,
    })
    const authLink = setContext(async (_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = await AsyncStorage.getItem(AUTH_TOKEN)

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
