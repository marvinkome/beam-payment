import React, { useState } from "react"
import auth from "@react-native-firebase/auth"
import { useNavigation } from "@react-navigation/native"
import { SetPinScreen } from "./SetPin"

export function SetPin() {
    const { navigate } = useNavigation()
    const [pin, setPin] = useState("")
    const onContinue = async () => {
        try {
            // get current user idToken
            const idToken = await auth().currentUser?.getIdToken()
            if (!idToken) {
                // redirect back to SignUp
                return navigate("SignUp")
            }

            // send idToken to the backend
            console.log(idToken, pin)
        } catch (e) {}
    }

    return <SetPinScreen pin={pin} setPin={setPin} onContinue={onContinue} />
}
