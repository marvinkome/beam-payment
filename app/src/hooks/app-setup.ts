import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { apolloSetup } from "libs/apollo"
import { USER_PUB_DETAIL } from "libs/keys"
import { authToken } from "store/authStore"

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
            const { client } = await apolloSetup(authContext.signOut)

            setApolloClient(client)

            // stop loader
            setLoading(false)
        }

        init()
    }, [])

    const signIn = async () => {
        setLoggedIn(true)
    }

    const signOut = async () => {
        setLoggedIn(false)
        authToken("")
        await AsyncStorage.removeItem(USER_PUB_DETAIL)
    }

    const authContext = {
        signOut,
        signIn,
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
