import React from "react"
import { PhoneNumberInput } from "components/PhoneNumberInput"
import { View, ScrollView, StyleSheet } from "react-native"
import { Button, Input } from "react-native-elements"
import { colorTheme } from "styles/theme"

type IProps = {
    loading: boolean
    disableBtn: boolean

    amount: string
    onChangeAmount: (amount: string) => void

    receiverNumber: string
    onChangeReceiverNumber: (receiverNumber: string) => void

    onContinue: () => void
}
export function TransferScreen(props: IProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                    disabled={props.disableBtn}
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
        </ScrollView>
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
