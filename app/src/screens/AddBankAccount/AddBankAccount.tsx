import React from "react"
import { StyleSheet, View } from "react-native"
import { Button, Input, Text } from "react-native-elements"
import { Picker } from "components/Picker"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"

const data = Array(50)
    .fill(0)
    .map((_, index) => ({ Name: `Index ${index}`, Value: `${index}`, Id: `${index}` }))

export function AddBackAccountScreen() {
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
                value=""
            />

            <Picker
                label="Bank name:"
                placeholder="Select bank name"
                pickerHeaderTitle="Select bank"
                searchPlaceholder="Search bank"
                data={data}
            />

            <View style={styles.verificationCard}>
                <Text style={styles.verificationText}>Bobby Lenny Johnson</Text>
                <Text style={styles.verificationText}>Guaranty Trust Bank</Text>
                <Text style={styles.verificationText}>04132546783</Text>
            </View>

            <View style={styles.footer}>
                <Button
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
