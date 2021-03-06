import React, { useEffect, useState } from "react"
import * as Sentry from "@sentry/react-native"
import auth from "@react-native-firebase/auth"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { smsConfirmationObj } from "store/authStore"
import { SignUpScreen } from "./SignUp"
import { routes } from "libs/navigator"
import { trackEvent } from "libs/analytics"

export function SignUp() {
    const { navigate } = useNavigation()
    const [sendingSms, setSendingSms] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")

    const signInWithPhoneNumber = async (escapedNumber: string) => {
        Sentry.addBreadcrumb({ message: `Start sms verification` })
        setSendingSms(true)

        try {
            const confirmation = await auth().signInWithPhoneNumber(escapedNumber)

            // set confirmation in a global state
            smsConfirmationObj({ confirmation, phoneNumber: escapedNumber })

            // move to next screen
            setSendingSms(false)
            setPhoneNumber("")

            navigate(routes.public.verifyPhone)
        } catch (e) {
            trackEvent("Phone number verification failed", { phoneNumber: escapedNumber })

            Sentry.captureException(e)
            setSendingSms(false)
            Alert.alert("Error", "Something went wrong. Please try again")
        }
    }

    return (
        <SignUpScreen
            phoneNumber={phoneNumber}
            onChangePhoneNumber={(value) => setPhoneNumber(value)}
            onContinue={signInWithPhoneNumber}
            loading={sendingSms}
        />
    )
}
