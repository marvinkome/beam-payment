import React from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { Button, Input, Text } from "react-native-elements"
import { Picker, PickerValue } from "components/Picker"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"

const allBanksJson = require("assets/banks.json")

type IProps = {
    accountNumber: string
    setAccountNumber: (accountNumber: string) => void
    bank: PickerValue | null
    setBank: (bank: PickerValue) => void

    loadingAccountDetails?: boolean
    accountName?: string

    loading?: boolean
    onContinue: () => void
}
export function AddBackAccountScreen(props: IProps) {
    let buttonDisabled = !!props.accountNumber && props.bank && !!props.accountName

    return (
        <View style={styles.container}>
            <Text h2 style={styles.mainText}>
                Add your bank account
            </Text>

            <Input
                containerStyle={styles.inputContainer}
                label="Account number:"
                placeholder="Enter account number"
                keyboardType="number-pad"
                value={props.accountNumber}
                onChangeText={(text) => props.setAccountNumber(text)}
                disabled={props.loadingAccountDetails}
            />

            <Picker
                label="Bank name:"
                placeholder="Select bank name"
                pickerHeaderTitle="Select bank"
                searchPlaceholder="Search bank"
                data={allBanksJson.data.map((bank: any) => ({
                    Name: bank.name,
                    Value: bank.code,
                    Id: `${bank.id}`,
                }))}
                value={props.bank}
                onChange={props.setBank}
                disabled={props.loadingAccountDetails}
            />

            {(props.loadingAccountDetails || !!props.accountName) && (
                <View style={styles.verificationCard}>
                    {props.loadingAccountDetails ? (
                        <ActivityIndicator size="small" color={colorTheme.black} />
                    ) : (
                        <>
                            <Text style={styles.verificationText}>{props.accountName}</Text>
                            <Text style={styles.verificationText}>{props.bank?.Name}</Text>
                            <Text style={styles.verificationText}>{props.accountNumber}</Text>
                        </>
                    )}
                </View>
            )}

            <View style={styles.footer}>
                <Button
                    disabled={!buttonDisabled}
                    loading={props.loading}
                    onPress={props.onContinue}
                    titleStyle={{ textTransform: "none", letterSpacing: 0.4 }}
                    title="Add Account"
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 25,
    },

    mainText: {
        marginHorizontal: 10,
        marginBottom: 30,
    },

    inputContainer: {
        marginBottom: 20,
    },

    verificationCard: {
        backgroundColor: colorTheme.grey,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        paddingVertical: 25,
        marginBottom: 50,
        borderRadius: 10,
        alignItems: "center",
    },

    verificationText: {
        ...fonts.semiBold,
        marginBottom: 7,
    },

    footer: {
        flex: 1,
        marginBottom: 5,
        justifyContent: "flex-end",
    },
})
