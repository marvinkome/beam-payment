import React from "react"
import { StyleSheet, ScrollView } from "react-native"
import { Button, Text } from "react-native-elements"
import { PinInput } from "components/PinInput"
import { colorTheme } from "styles/theme"

export function VerifyPhoneScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* phone text */}
            <Text style={styles.phoneText} h2>
                Sent code to {"\n"}+234913498619
            </Text>

            {/* input mask */}
            <PinInput testID="codeInput" codeLength={5} />

            {/* resend button */}
            <Text style={styles.resend}>
                Didn't receive code?{" "}
                <Text style={{ color: colorTheme.primary, fontSize: 18 }}>Send again</Text>
            </Text>

            {/* continue button */}
            <Button disabled title="Continue" />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 25,
    },

    phoneText: {
        marginTop: 10,
        marginBottom: 20,
        textAlign: "center",
        letterSpacing: 0.8,
        lineHeight: 37,
    },

    resend: {
        marginTop: 60,
        textAlign: "center",
        fontSize: 18,
        marginBottom: 60,
    },
})
