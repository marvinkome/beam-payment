import React from "react"
import { useNavigation } from "@react-navigation/native"
import { ScrollView, View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-elements"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"
import { routes } from "libs/navigator"
import { formatCurrency } from "libs/helpers"

type IProps = {
    accountBalance: number
    bankDetails?: {
        accountNumber: string
        bankName: string
    }

    withdrawing?: boolean
    onWithdraw: () => void
}
export function CashSettingsScreen(props: IProps) {
    const { navigate } = useNavigation()

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text h2 style={{ marginBottom: 15 }}>
                    Add money
                </Text>

                <Text style={styles.cardText}>NGN {formatCurrency(props.accountBalance)}</Text>

                <Button
                    containerStyle={styles.buttonContainer}
                    titleStyle={styles.buttonText}
                    icon={{ name: "plus", type: "feather", color: colorTheme.white, size: 20 }}
                    title="Add money"
                    onPress={() => navigate(routes.main.addMoney)}
                />
            </View>

            {/* take out money card */}
            <View style={styles.card}>
                <Text h2 style={{ marginBottom: 15 }}>
                    Take out money
                </Text>

                <Text style={styles.cardText}>{props.bankDetails?.bankName}</Text>
                <Text style={styles.cardText}>{props.bankDetails?.accountNumber}</Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Button
                        containerStyle={styles.buttonContainer}
                        buttonStyle={{ borderWidth: 2 }}
                        titleStyle={styles.buttonText}
                        icon={{
                            name: "download",
                            type: "feather",
                            color: colorTheme.primary,
                            size: 20,
                            style: { marginRight: 10 },
                        }}
                        type="outline"
                        title="Withdraw"
                        onPress={props.onWithdraw}
                        loading={props.withdrawing}
                    />

                    <Button
                        containerStyle={styles.buttonContainer}
                        buttonStyle={{ borderWidth: 2 }}
                        titleStyle={styles.buttonText}
                        icon={{
                            name: "settings",
                            type: "feather",
                            color: colorTheme.primary,
                            size: 20,
                            style: { marginRight: 10 },
                        }}
                        type="outline"
                        title="Change"
                        onPress={() => navigate(routes.main.addAccount)}
                    />
                </View>
            </View>

            <Text style={styles.footerText}>Need help? Send an email to team@usebeam.com</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 25,
    },

    card: {
        backgroundColor: colorTheme.grey,
        paddingHorizontal: 20,
        paddingVertical: 25,
        marginBottom: 30,
        borderRadius: 20,
        elevation: 3,
    },

    cardText: {
        color: colorTheme.textLight,
        ...fonts.semiBold,
    },

    buttonContainer: {
        width: 150,
        marginHorizontal: 0,
        marginTop: 35,
    },

    buttonText: {
        textTransform: "none",
        letterSpacing: 0.7,
    },

    footerText: {
        color: colorTheme.primary,
        fontSize: 16,
        marginTop: 15,
        ...fonts.semiBold,
    },
})
