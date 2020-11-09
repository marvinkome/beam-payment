import React from "react"
import BeamLogo from "assets/images/beam-logo-dark.svg"
import { PinInput } from "components/PinInput"
import { TextLink } from "components/TextLink"
import { StyleSheet, ScrollView, View } from "react-native"
import { Button, Text } from "react-native-elements"

type IProps = {
    pin: string
    loading?: boolean
    setPin: (pin: string) => void
    onContinue: () => void
    onForgetPin: () => void
}
export function LoginScreen(props: IProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <BeamLogo width={100} />
            </View>

            <Text h3 style={styles.mainText}>
                Enter your pin to login
            </Text>

            {/* input mask */}
            <PinInput
                secure
                value={props.pin}
                onChange={props.setPin}
                testID="codeInput"
                codeLength={4}
            />

            <TextLink onPress={props.onForgetPin} style={{ textAlign: "center", marginTop: 30 }}>
                Forgot pin?
            </TextLink>

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

    buttonContainer: {
        marginTop: 90,
        marginHorizontal: 30,
    },
})
