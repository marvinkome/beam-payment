import AsyncStorage from "@react-native-async-storage/async-storage"
import { useContext } from "react"
import { AuthContext } from "libs/auth-context"
import { gql, useMutation } from "@apollo/client"
import { ToastAndroid } from "react-native"
import { authToken } from "store/authStore"
import { USER_PUB_DETAIL } from "libs/keys"

export const AUTH_USER_MUT = gql`
    mutation AuthenticateUser($idToken: String!) {
        authenticateUser(idToken: $idToken) {
            success
            responseMessage
            token
            user {
                id
                isNewAccount
                accountSetupState
            }
        }
    }
`

export function useAuthentication() {
    const authContext = useContext(AuthContext)
    const [authenticateUserMutation] = useMutation(AUTH_USER_MUT)

    const signIn = async (idToken: string, phoneNumber: string) => {
        // TODO:: sentry breadcrumb - request started
        let loginResp = null

        try {
            loginResp = await authenticateUserMutation({
                variables: { idToken },
            })
        } catch (err) {
            // TODO:: sentry - track failed signup
            return ToastAndroid.show("Failed to sign in", ToastAndroid.SHORT)
        }

        const { token, success, responseMessage } = loginResp?.data?.authenticateUser

        if (!success) {
            // TODO:: sentry - track failed signup
            return ToastAndroid.show(responseMessage, ToastAndroid.SHORT)
        }

        // setup user data
        await AsyncStorage.setItem(USER_PUB_DETAIL, phoneNumber)
        await authToken(token)

        // TODO:: Add user to analytics
        // TODO:: Track successful sign up

        // finish auth here
        return authContext?.signIn()
    }

    return { signIn }
}
