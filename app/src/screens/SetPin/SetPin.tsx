import React from "react"
import { PinInput } from "components/PinInput"
import { StyleSheet, ScrollView } from "react-native"
import { Button, Text } from "react-native-elements"

type IProps = {
    pin: string
    loading?: boolean
    setPin: (pin: string) => void
    onContinue: () => void
}
export function SetPinScreen(props: IProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text h3 style={styles.mainText}>
                Set your pin
            </Text>

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
                loading={props.loading}
                title="Continue"
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 60,
    },

    mainText: {
        marginBottom: 45,
        textAlign: "center",
        letterSpacing: 0.8,
    },

    buttonContainer: {
        marginTop: 90,
        marginHorizontal: 30,
    },
})
