import AsyncStorage from "@react-native-async-storage/async-storage"
import { useContext, useState } from "react"
import { AuthContext } from "libs/auth-context"
import { gql, useMutation } from "@apollo/client"
import { ToastAndroid } from "react-native"
import { AUTH_TOKEN } from "libs/keys"
import { navigate } from "libs/navigator"

export const AUTH_USER_MUT = gql`
    mutation AuthenticateUser($idToken: String!) {
        authenticateUser(idToken: $idToken) {
            success
            responseMessage
            isNewAccount
            token
            user {
                id
            }
        }
    }
`
export function useAuthentication() {
    const authContext = useContext(AuthContext)
    const [authenticateUserMutation] = useMutation(AUTH_USER_MUT)

    const signIn = async (idToken: string) => {
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

        const { token, success, responseMessage, isNewAccount } = loginResp?.data?.authenticateUser

        if (!success) {
            // TODO:: sentry - track failed signup
            return ToastAndroid.show(responseMessage, ToastAndroid.SHORT)
        }

        // setup user data
        await AsyncStorage.setItem(AUTH_TOKEN, token)

        // TODO:: Add user to analytics
        // TODO:: Track successful sign up

        if (isNewAccount) {
            // continue to set pin page
            navigate("SetPin")
        } else {
            // finish auth here
            return authContext?.signIn()
        }
    }

    return { signIn }
}
