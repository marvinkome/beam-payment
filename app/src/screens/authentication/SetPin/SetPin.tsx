import React from "react"
import { PinInput } from "components/PinInput"
import { StyleSheet, ScrollView } from "react-native"
import { Button } from "react-native-elements"

type IProps = {
    pin: string
    setPin: (pin: string) => void
    onContinue: () => void
}
export function SetPinScreen(props: IProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* input mask */}
            <PinInput
                secure
                value={props.pin}
                onChange={props.setPin}
                testID="codeInput"
                codeLength={4}
            />

            {/* continue button */}
            <Button
                containerStyle={styles.buttonContainer}
                disabled={props.pin.length !== 4}
                onPress={props.onContinue}
                title="Continue"
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 100,
    },

    buttonContainer: {
        marginTop: 90,
        marginHorizontal: 30,
    },
})
