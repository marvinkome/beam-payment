import React, { useEffect, useState } from "react"
import auth from "@react-native-firebase/auth"
import * as Sentry from "@sentry/react-native"
import { Alert } from "react-native"
import { smsConfirmationObj } from "store/authStore"
import { useAuthentication } from "hooks/login"
import { VerifyPhoneScreen } from "./VerifyPhone"

export function VerifyPhone() {
    const [code, setCode] = useState("")
    const [verifyingCode, setVerifyingCode] = useState(false)
    const { signIn } = useAuthentication()

    const { confirmation, phoneNumber } = smsConfirmationObj()

    const onVerify = async () => {
        setVerifyingCode(true)

        try {
            // first try to get the user idToken for auto verification
            let idToken = await auth().currentUser?.getIdToken()
            if (!idToken) {
                // if no idToken found, confirm code
                await confirmation?.confirm(code)
                idToken = await auth().currentUser?.getIdToken()
            }

            await signIn(idToken!, phoneNumber!)
        } catch (e) {
            Sentry.captureException(e)
            setVerifyingCode(false)
            Alert.alert("Error", "Invalid code")
        }
    }

    const onResendCode = async () => {
        setVerifyingCode(true)
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber!)
        smsConfirmationObj({ confirmation, phoneNumber })
        setVerifyingCode(false)
    }

    useEffect(() => {
        if (code.length === 6 && !verifyingCode) {
            onVerify()
        }
    }, [code])

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (user) => {
            if (user && !verifyingCode) {
                setVerifyingCode(true)
                const idToken = await user.getIdToken()
                await signIn(idToken!, phoneNumber!)
            }
        })

        return unsubscribe
    })

    return (
        <VerifyPhoneScreen
            phoneNumber={phoneNumber}
            onVerify={onVerify}
            code={code}
            setCode={setCode}
            loading={verifyingCode}
            resendCode={onResendCode}
        />
    )
}
