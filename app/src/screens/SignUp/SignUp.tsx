import React from "react"
import BeamLogo from "assets/images/beam-logo-dark.svg"
import { StyleSheet, ScrollView, View } from "react-native"
import { Text, Button } from "react-native-elements"
import { PhoneNumberInput } from "components/PhoneNumberInput"
import { colorTheme } from "styles/theme"

export function SignUpScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <BeamLogo width={100} />
            </View>

            {/* main text */}
            <Text h1 style={styles.mainText}>
                Send money to anyone with a phone number
            </Text>

            {/* phone number input */}
            <PhoneNumberInput withIcon containerStyle={styles.inputContainer} />

            {/* continue button */}
            <Button disabled title="Continue" />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },

    header: {
        paddingVertical: 15,
    },

    mainText: {
        marginVertical: 45,
        textAlign: "center",
        letterSpacing: 0.8,
    },

    inputContainer: {
        borderColor: colorTheme.primary,
        borderRadius: 50,
        marginVertical: 20,
        marginBottom: 50,
    },
})
