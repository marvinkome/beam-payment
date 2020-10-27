import React from "react"
import { StyleSheet, ScrollView } from "react-native"
import { Button, Text } from "react-native-elements"
import { PinInput } from "components/PinInput"
import { colorTheme } from "styles/theme"

type IProps = {
    loading: boolean
    code: string
    phoneNumber: string | null
    setCode: (code: string) => void
    onVerify: () => void
}
export function VerifyPhoneScreen(props: IProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* phone text */}
            <Text style={styles.phoneText} h2>
                Sent code to {"\n"}
                {props.phoneNumber}
            </Text>

            {/* input mask */}
            <PinInput
                value={props.code}
                onChange={props.setCode}
                testID="codeInput"
                codeLength={6}
            />

            {/* resend button */}
            <Text style={styles.resend}>
                Didn't receive code?{" "}
                <Text style={{ color: colorTheme.primary, fontSize: 18 }}>Send again</Text>
            </Text>

            {/* continue button */}
            <Button
                onPress={props.onVerify}
                disabled={!props.code.length}
                loading={props.loading}
                title="Continue"
            />
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
        marginBottom: 40,
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
