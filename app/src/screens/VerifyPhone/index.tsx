import React, { useEffect, useState } from "react"
import auth from "@react-native-firebase/auth"
import * as Sentry from "@sentry/react-native"
import { Alert } from "react-native"
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
            // first try to get the user idToken for auto verification
            let idToken = await auth().currentUser?.getIdToken()
            if (!idToken) {
                // if no idToken found, confirm code
                await confirmation?.confirm(code)
                idToken = await auth().currentUser?.getIdToken()
            }

            await signIn(idToken!, phoneNumber!)
            setVerifingCode(false)
        } catch (e) {
            Sentry.captureException(e)
            setVerifingCode(false)
            Alert.alert("Error", "Invalid code")
        }
    }

    const onResendCode = async () => {
        setVerifingCode(true)
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber!)
        smsConfirmationObj({ confirmation, phoneNumber })
        setVerifingCode(false)
    }

    useEffect(() => {
        if (code.length === 6) {
            onVerify()
        }
    }, [code])

    return (
        <VerifyPhoneScreen
            phoneNumber={phoneNumber}
            onVerify={onVerify}
            code={code}
            setCode={setCode}
            loading={verifingCode}
            resendCode={onResendCode}
        />
    )
}
