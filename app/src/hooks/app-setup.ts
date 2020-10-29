import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { AUTH_TOKEN } from "libs/keys"
import { apolloSetup } from "libs/apollo"

export function useAppSetup() {
    const [isLoading, setLoading] = useState(true)
    const [isLoggedIn, setLoggedIn] = useState(false)
    const [apolloClient, setApolloClient] = useState<any>(null)

    useEffect(() => {
        // run async tasks
        const init = async () => {
            // check auth state
            const token = await AsyncStorage.getItem(AUTH_TOKEN)
            setLoggedIn(!!token)

            // setup apollo
            const { client } = await apolloSetup()

            setApolloClient(client)

            // stop loader
            setLoading(false)
        }

        init()
    }, [])

    const authContext = {
        signIn: () => setLoggedIn(true),
        signOut: () => setLoggedIn(false), // TODO:: remove token after sign out
        isLoggedIn,
    }

    return {
        isLoading,
        isLoggedIn,
        apolloClient,
        authContext,
    }
}
