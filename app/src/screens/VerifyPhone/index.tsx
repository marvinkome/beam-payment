import React, { useState } from "react"
import auth from "@react-native-firebase/auth"
import { ToastAndroid } from "react-native"
import { smsConfirmationObj } from "store/authStore"
import { useAuthentication } from "hooks/login"
import { VerifyPhoneScreen } from "./VerifyPhone"

export function VerifyPhone() {
    const [code, setCode] = useState("")
    const [verifingCode, setVerifingCode] = useState(false)
    const { signIn } = useAuthentication()
    const { confirmation, phoneNumber } = smsConfirmationObj()

    const onVerify = async () => {
        setVerifingCode(true)

        try {
            await confirmation?.confirm(code)
            const idToken = await auth().currentUser?.getIdToken()

            if (!idToken) {
                throw new Error()
            }

            await signIn(idToken)
            setVerifingCode(false)
        } catch (e) {
            setVerifingCode(false)
            ToastAndroid.show("Invalid code", ToastAndroid.SHORT)
        }
    }

    return (
        <VerifyPhoneScreen
            phoneNumber={phoneNumber}
            onVerify={onVerify}
            code={code}
            setCode={setCode}
            loading={verifingCode}
        />
    )
}
