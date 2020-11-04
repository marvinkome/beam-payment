import AsyncStorage from "@react-native-async-storage/async-storage"
import { useContext } from "react"
import { AuthContext } from "libs/auth-context"
import { gql, useMutation } from "@apollo/client"
import { Alert } from "react-native"
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
            console.log(err)
            return Alert.alert("Error!", "Failed to sign in")
        }

        const { token, success, responseMessage } = loginResp?.data?.authenticateUser

        if (!success) {
            // TODO:: sentry - track failed signup
            return Alert.alert("Error!", responseMessage)
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

export const LOGIN_MUT = gql`
    mutation LoginUser($phoneNumber: String!, $pin: String!) {
        loginUser(phoneNumber: $phoneNumber, pin: $pin) {
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

export function useLogin() {
    const authContext = useContext(AuthContext)
    const [loginMutation] = useMutation(LOGIN_MUT)

    const signIn = async (pin: string) => {
        // TODO:: sentry breadcrumb - request started
        let loginResp = null
        const phoneNumber = await AsyncStorage.getItem(USER_PUB_DETAIL)

        try {
            loginResp = await loginMutation({
                variables: { phoneNumber, pin },
            })
        } catch (err) {
            // TODO:: sentry - track failed signup
            console.log(err)
            return Alert.alert("Error!", "Failed to sign in")
        }

        const { token, success, responseMessage } = loginResp?.data?.loginUser

        if (!success) {
            // TODO:: sentry - track failed signup
            return Alert.alert("Error!", responseMessage)
        }

        // setup user data
        await authToken(token)

        // TODO:: Add user to analytics
        // TODO:: Track successful sign up

        // finish auth here
        return authContext?.signIn()
    }

    return { signIn }
}
