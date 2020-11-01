import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { apolloSetup } from "libs/apollo"
import { USER_PUB_DETAIL } from "libs/keys"

export function useAppSetup() {
    const [isLoading, setLoading] = useState(true)
    const [isLoggedIn, setLoggedIn] = useState(false)
    const [hasPublicDetails, setHasPublicDetails] = useState(false)
    const [apolloClient, setApolloClient] = useState<any>(null)

    useEffect(() => {
        // run async tasks
        const init = async () => {
            const publicDetails = await AsyncStorage.getItem(USER_PUB_DETAIL)
            if (!!publicDetails) {
                setHasPublicDetails(true)
            }

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
        signOut: () => setLoggedIn(false), // TODO:: remove token and public details after sign out
        isLoggedIn,
        hasPublicDetails,
    }

    return {
        isLoading,
        isLoggedIn,
        apolloClient,
        authContext,
    }
}
