import React, { useState } from "react"
import auth from "@react-native-firebase/auth"
import { ToastAndroid } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { escapePhoneNumber } from "libs/helpers"
import { smsConfirmationObj } from "store/authStore"
import { SignUpScreen } from "./SignUp"

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
            navigate("VerifyPhone")
        } catch (e) {
            setSendingSms(false)
            ToastAndroid.show("Please use a correct phone number", ToastAndroid.SHORT)
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