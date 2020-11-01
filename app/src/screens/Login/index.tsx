import React, { useState } from "react"
import { LoginScreen } from "./Login"
import { useLogin } from "hooks/login"

export function Login() {
    const [pin, setPin] = useState("")
    const [signingIn, setSigningIn] = useState(false)
    const { signIn } = useLogin()

    const onContinue = async () => {
        setSigningIn(true)
        await signIn(pin)
        setSigningIn(false)
    }

    return <LoginScreen pin={pin} setPin={setPin} loading={signingIn} onContinue={onContinue} />
}
