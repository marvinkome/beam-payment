import React from "react"
import { PinInput } from "components/PinInput"
import { StyleSheet, ScrollView } from "react-native"
import { Button } from "react-native-elements"

export function SetPinScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* input mask */}
            <PinInput testID="codeInput" codeLength={4} />

            {/* continue button */}
            <Button containerStyle={styles.buttonContainer} disabled title="Continue" />
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
