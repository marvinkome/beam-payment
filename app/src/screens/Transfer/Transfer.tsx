import React from "react"
import { PhoneNumberInput } from "components/PhoneNumberInput"
import { View, StyleSheet } from "react-native"
import { Button, Input } from "react-native-elements"
import { colorTheme } from "styles/theme"

function disableButton(props: IProps) {
    if (!props.amount.length) return true
    if (!props.receiverNumber.length) return true
    if (props.receiverNumber.length < 10) return true

    return false
}

type IProps = {
    loading: boolean

    amount: string
    onChangeAmount: (amount: string) => void

    receiverNumber: string
    onChangeReceiverNumber: (receiverNumber: string) => void

    onContinue: () => void
}
export function TransferScreen(props: IProps) {
    return (
        <View style={styles.container}>
            <Input
                containerStyle={styles.inputContainer}
                label="How much:"
                placeholder="Enter amount"
                keyboardType="number-pad"
                value={props.amount}
                onChangeText={(text) => props.onChangeAmount(text)}
            />

            <PhoneNumberInput
                containerStyle={styles.inputContainer}
                label="Receiver's number:"
                placeholder="Enter phone number"
                value={props.receiverNumber}
                onChange={(text) => props.onChangeReceiverNumber(text)}
            />

            <View style={styles.footer}>
                <Button
                    loading={props.loading}
                    disabled={disableButton(props)}
                    onPress={props.onContinue}
                    title="Send money"
                    icon={{
                        name: "send",
                        size: 16,
                        color: colorTheme.white,
                        containerStyle: styles.buttonIcon,
                    }}
                    iconRight
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 600,
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 15,
    },

    inputContainer: {
        marginBottom: 30,
    },

    buttonIcon: {
        marginLeft: 13,
    },

    footer: {
        flex: 1,
        justifyContent: "flex-end",
    },
})
