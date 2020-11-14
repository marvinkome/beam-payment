import * as Sentry from "@sentry/react-native"
import messaging from "@react-native-firebase/messaging"
import { gql, useMutation } from "@apollo/client"

export const NOTIFICATION_MUT = gql`
    mutation SetNotificationToken($token: String!) {
        setNotificationToken(token: $token) {
            success
            responseMessage
            user {
                id
                phoneNumber
                notificationToken
            }
        }
    }
`

export function useStoreNotification() {
    const [setNotificationToken] = useMutation(NOTIFICATION_MUT)

    return async () => {
        try {
            const token = await messaging().getToken()
            await setNotificationToken({ variables: { token } })
        } catch (e) {
            Sentry.captureException(e)
        }
    }
}
