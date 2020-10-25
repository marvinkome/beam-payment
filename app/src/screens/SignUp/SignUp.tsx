import React from "react"
import BeamLogo from "assets/images/beam-logo-dark.svg"
import { StyleSheet, ScrollView, View } from "react-native"
import { Text, Button } from "react-native-elements"
import { PhoneNumberInput } from "components/PhoneNumberInput"
import { colorTheme } from "styles/theme"

type IProps = {
    phoneNumber: string
    onChangePhoneNumber: (number: string) => void
    onContinue: () => void
    loading: boolean
}
export function SignUpScreen(props: IProps) {
    return (
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <BeamLogo width={100} />
            </View>

            {/* main text */}
            {/* TODO:: Add carousel */}
            <Text h1 style={styles.mainText}>
                Send money to anyone with a phone number
            </Text>

            {/* phone number input */}
            <PhoneNumberInput
                withIcon
                placeholder="Your phone number"
                containerStyle={styles.inputContainer}
                onChange={props.onChangePhoneNumber}
                value={props.phoneNumber}
            />

            {/* continue button */}
            <Button
                onPress={props.onContinue}
                disabled={!props.phoneNumber.length}
                loading={props.loading}
                title="Continue"
                containerStyle={styles.buttonContainer}
            />
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
    },

    buttonContainer: {
        marginTop: "30%",
    },
})
