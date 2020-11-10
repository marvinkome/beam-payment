import React, { useState } from "react"
import * as Sentry from "@sentry/react-native"
import { useNavigation } from "@react-navigation/native"
import { gql, useMutation } from "@apollo/client"
import { SetPinScreen } from "./SetPin"
import { Alert } from "react-native"
import { routes } from "libs/navigator"
import { trackEvent } from "libs/analytics"

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
    const [savePin] = useMutation(SAVE_PIN)
    const [savingPin, setSavingPin] = useState(false)
    const { navigate } = useNavigation()

    return {
        savingPin,
        savePin: async (pin: string) => {
            setSavingPin(true)

            try {
                const savePinResp = await savePin({ variables: { pin } })
                const { success, responseMessage } = savePinResp?.data?.setPin

                if (!success) {
                    Sentry.captureMessage(responseMessage)
                    return Alert.alert("Error!", responseMessage)
                }

                trackEvent("Set pin")
                navigate(routes.main.onboarding.addMoney)
            } catch (e) {
                Sentry.captureException(e)
                Alert.alert("Error!", "Error saving pin. Try again")
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
