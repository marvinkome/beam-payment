import React, { useEffect } from "react"
import BeamLogo from "assets/images/beam-logo-dark.svg"
import { StyleSheet, ScrollView, View } from "react-native"
import { Text, Button } from "react-native-elements"
import { PhoneNumberInput } from "components/PhoneNumberInput"
import { colorTheme } from "styles/theme"
import { escapePhoneNumber, isPhoneNumber } from "libs/helpers"

type IProps = {
    phoneNumber: string
    onChangePhoneNumber: (number: string) => void
    onContinue: (phoneNumber: string) => void
    loading: boolean
}
export function SignUpScreen(props: IProps) {
    useEffect(() => {
        const number = `+234${escapePhoneNumber(props.phoneNumber)}`

        if (isPhoneNumber(number)) {
            props.onContinue(number)
        }
    }, [props.phoneNumber])

    return (
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <BeamLogo width={100} />
            </View>

            {/* main text */}
            <Text h1 style={styles.mainText}>
                Pay anyone without cash
            </Text>

            {/* phone number input */}
            <PhoneNumberInput
                withIcon
                inputProps={{ autoFocus: true }}
                placeholder="Your phone number"
                containerStyle={styles.inputContainer}
                onChange={props.onChangePhoneNumber}
                value={props.phoneNumber}
            />

            {/* continue button */}
            <Button
                onPress={() => props.onContinue(`+234${escapePhoneNumber(props.phoneNumber)}`)}
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
