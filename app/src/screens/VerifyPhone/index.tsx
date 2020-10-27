import React, { useState } from "react"
import { ToastAndroid } from "react-native"
import { smsConfirmationObj } from "store/authStore"
import { useNavigation } from "@react-navigation/native"
import { VerifyPhoneScreen } from "./VerifyPhone"

export function VerifyPhone() {
    const { navigate } = useNavigation()
    const [code, setCode] = useState("")
    const [verifingCode, setVerifingCode] = useState(false)
    const { confirmation, phoneNumber } = smsConfirmationObj()

    const onVerify = async () => {
        setVerifingCode(true)

        try {
            await confirmation?.confirm(code)

            setVerifingCode(false)
            setCode("")
            navigate("SetPin")
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
