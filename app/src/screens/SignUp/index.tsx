import React, { useState } from "react"
import auth from "@react-native-firebase/auth"
import { useNavigation } from "@react-navigation/native"
import { escapePhoneNumber } from "libs/helpers"
import { smsConfirmationObj } from "store/globalStore"
import { SignUpScreen } from "./SignUp"

export function SignUp() {
    const { navigate } = useNavigation()
    const [sendingSms, setSendingSms] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")

    const verifyPhoneNumber = async () => {
        const escapedNumber = escapePhoneNumber(phoneNumber)
        setSendingSms(true)

        const confirmation = await auth().verifyPhoneNumber(`+234${escapedNumber}`)

        // set confirmation in a global state
        smsConfirmationObj({ confirmation, phoneNumber: `+234${escapedNumber}` })

        // move to next screen
        setSendingSms(false)
        setPhoneNumber("")
        navigate("VerifyPhone")
    }

    return (
        <SignUpScreen
            phoneNumber={phoneNumber}
            onChangePhoneNumber={(value) => setPhoneNumber(value)}
            onContinue={verifyPhoneNumber}
            loading={sendingSms}
        />
    )
}
