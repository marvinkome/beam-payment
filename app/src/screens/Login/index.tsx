import React, { useState, useEffect } from "react"
import { LoginScreen } from "./Login"
import { useForgetPin, useLogin } from "hooks/login"

export function Login() {
    const [pin, setPin] = useState("")
    const [signingIn, setSigningIn] = useState(false)
    const { signIn } = useLogin()
    const { forgetPin } = useForgetPin()

    const onContinue = async () => {
        setSigningIn(true)
        await signIn(pin)
        setSigningIn(false)
    }

    const onForgetPin = async () => {
        setSigningIn(true)
        await forgetPin()
        setSigningIn(false)
    }

    useEffect(() => {
        if (pin.length === 4) {
            onContinue()
        }
    }, [pin])

    return (
        <LoginScreen
            pin={pin}
            setPin={setPin}
            loading={signingIn}
            onContinue={onContinue}
            onForgetPin={onForgetPin}
        />
    )
}
