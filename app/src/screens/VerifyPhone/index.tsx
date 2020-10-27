import React, { useState } from "react"
import { ToastAndroid } from "react-native"
import { smsConfirmationObj } from "store/authStore"
import { VerifyPhoneScreen } from "./VerifyPhone"

export function VerifyPhone() {
    const [code, setCode] = useState("")
    const [verifingCode, setVerifingCode] = useState(false)
    const { confirmation, phoneNumber } = smsConfirmationObj()

    const onVerify = async () => {
        setVerifingCode(true)

        try {
            const cred = await confirmation?.confirm(code)
            const idToken = await cred?.user.getIdToken()

            setVerifingCode(false)
            setCode("")
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
