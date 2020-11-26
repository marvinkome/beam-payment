import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Sentry from "@sentry/react-native"
import * as analytics from "libs/analytics"
import { useContext } from "react"
import { AuthContext } from "libs/auth-context"
import { gql, useMutation } from "@apollo/client"
import { Alert } from "react-native"
import { authToken } from "store/authStore"
import { USER_PUB_DETAIL } from "libs/keys"
import { useStoreNotification } from "./notifications"

export const AUTH_USER_MUT = gql`
    mutation AuthenticateUser($idToken: String!) {
        authenticateUser(idToken: $idToken) {
            success
            responseMessage
            token
            user {
                id
                phoneNumber
                isNewAccount
                accountSetupState
            }
        }
    }
`
export function useAuthentication() {
    const authContext = useContext(AuthContext)
    const [authenticateUserMutation] = useMutation(AUTH_USER_MUT)
    const storeNotification = useStoreNotification()

    const signIn = async (idToken: string, phoneNumber: string) => {
        Sentry.addBreadcrumb({ message: "Registration request started" })

        let loginResp = null

        try {
            loginResp = await authenticateUserMutation({
                variables: { idToken },
            })
        } catch (err) {
            Sentry.captureException(err)
            return Alert.alert("Error", "Failed to sign in")
        }

        const { token, success, responseMessage, user } = loginResp?.data?.authenticateUser

        if (!success) {
            Sentry.captureMessage(responseMessage)
            return Alert.alert("Error", responseMessage)
        }

        // setup user data
        await AsyncStorage.setItem(USER_PUB_DETAIL, phoneNumber)
        authToken(token)

        // store notification
        await storeNotification()

        analytics.setUser(user.id, { phone: user.phoneNumber })
        analytics.trackEvent("Login successful")

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
    const storeNotification = useStoreNotification()

    const signIn = async (pin: string) => {
        Sentry.addBreadcrumb({ message: "Login request started" })

        let loginResp = null
        const phoneNumber = await AsyncStorage.getItem(USER_PUB_DETAIL)

        try {
            loginResp = await loginMutation({
                variables: { phoneNumber, pin },
            })
        } catch (err) {
            Sentry.captureException(err)
            return Alert.alert("Error!", "Failed to sign in")
        }

        const { token, success, responseMessage, user } = loginResp?.data?.loginUser

        if (!success) {
            Sentry.captureMessage(responseMessage)
            return Alert.alert("Error!", responseMessage)
        }

        // setup user data
        authToken(token)

        // store notification token
        await storeNotification()

        analytics.setUser(user.id, { phone: `${user.phoneNumber}` })
        analytics.trackEvent("Login successful")

        // finish auth here
        return authContext?.signIn()
    }

    return { signIn }
}

export const FORGET_PIN_MUT = gql`
    mutation ForgetPin($phoneNumber: String!) {
        forgetPin(phoneNumber: $phoneNumber)
    }
`
export function useForgetPin() {
    const authContext = useContext(AuthContext)
    const [forgetPinMut] = useMutation(FORGET_PIN_MUT)

    const forgetPin = async () => {
        Sentry.addBreadcrumb({ message: "forget pin request started" })

        let forgetPinResp = null
        const phoneNumber = await AsyncStorage.getItem(USER_PUB_DETAIL)

        try {
            forgetPinResp = await forgetPinMut({ variables: { phoneNumber } })
        } catch (err) {
            Sentry.captureException(err)
            return Alert.alert("Error", "Failed to forget pin")
        }

        const success = forgetPinResp?.data?.forgetPin

        if (!success) {
            return Alert.alert("Error", "Something went wrong")
        }

        // finish auth here
        return authContext?.signOut(true)
    }

    return { forgetPin }
}
