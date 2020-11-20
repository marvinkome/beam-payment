import React, { useEffect, useState } from "react"
import * as Sentry from "@sentry/react-native"
import auth from "@react-native-firebase/auth"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { escapePhoneNumber } from "libs/helpers"
import { smsConfirmationObj } from "store/authStore"
import { SignUpScreen } from "./SignUp"
import { routes } from "libs/navigator"

export function SignUp() {
    const { navigate } = useNavigation()
    const [sendingSms, setSendingSms] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")

    const signInWithPhoneNumber = async () => {
        const escapedNumber = escapePhoneNumber(phoneNumber)

        setSendingSms(true)
        try {
            const confirmation = await auth().signInWithPhoneNumber(`+234${escapedNumber}`)

            // set confirmation in a global state
            smsConfirmationObj({ confirmation, phoneNumber: `+234${escapedNumber}` })

            // move to next screen
            setSendingSms(false)
            setPhoneNumber("")

            navigate(routes.public.verifyPhone)
        } catch (e) {
            Sentry.captureException(e)
            setSendingSms(false)
            Alert.alert("Error", "Something went wrong. Please try again")
        }
    }

    useEffect(() => {
        if (phoneNumber.length === 10) {
            signInWithPhoneNumber()
        }
    }, [phoneNumber])

    return (
        <SignUpScreen
            phoneNumber={phoneNumber}
            onChangePhoneNumber={(value) => setPhoneNumber(value)}
            onContinue={signInWithPhoneNumber}
            loading={sendingSms}
        />
    )
}
