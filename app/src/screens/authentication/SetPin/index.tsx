import React, { useContext, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { gql, useMutation } from "@apollo/client"
import { SetPinScreen } from "./SetPin"
import { ToastAndroid } from "react-native"
import { AuthContext } from "libs/auth-context"

export const SAVE_PIN = gql`
    mutation SetPin($pin: String!) {
        setPin(pin: $pin) {
            success
            responseMessage
            user {
                id
            }
        }
    }
`

function useSavePin() {
    const authContext = useContext(AuthContext)
    const [savePin] = useMutation(SAVE_PIN)
    const [savingPin, setSavingPin] = useState(false)

    return {
        savingPin,
        savePin: async (pin: string) => {
            setSavingPin(true)
            try {
                const savePinResp = await savePin({ variables: { pin } })
                const { success, responseMessage } = savePinResp?.data?.setPin

                if (!success) {
                    return ToastAndroid.show(responseMessage, ToastAndroid.SHORT)
                }

                authContext?.signIn()
            } catch (e) {
                console.log(e)
                ToastAndroid.show("Error saving pin. Try again", ToastAndroid.SHORT)
            }
        },
    }
}

export function SetPin() {
    const [pin, setPin] = useState("")
    const { savePin, savingPin } = useSavePin()

    return (
        <SetPinScreen
            loading={savingPin}
            pin={pin}
            setPin={setPin}
            onContinue={() => savePin(pin)}
        />
    )
}
