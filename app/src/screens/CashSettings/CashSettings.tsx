import React from "react"
import { useNavigation } from "@react-navigation/native"
import { ScrollView, View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-elements"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"
import { routes } from "libs/navigator"
import { EMAIL_URL } from "libs/keys"

type IProps = {
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
                <Text h1 style={{ marginBottom: 15 }}>
                    Add money
                </Text>

                <Button
                    containerStyle={styles.buttonContainer}
                    titleStyle={styles.buttonText}
                    icon={{ name: "plus", type: "feather", color: colorTheme.white, size: 20 }}
                    title="Add money"
                    onPress={() => navigate(routes.main.addMoney)}
                />
            </View>

            {/* invite your friends */}

            {/* take out money card */}
            <View style={styles.card}>
                <Text h1 style={{ marginBottom: 15 }}>
                    Take out money
                </Text>

                <Text style={styles.cardText}>{props.bankDetails?.bankName}</Text>
                <Text style={{ ...styles.cardText, marginBottom: 15 }}>
                    {props.bankDetails?.accountNumber}
                </Text>

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
                    title="Change bank account"
                    onPress={() => navigate(routes.main.addAccount)}
                />
            </View>

            <Text style={styles.footerText}>
                Need help? Send an email to{" "}
                <Text style={{ ...fonts.bold, color: colorTheme.primary }}>{EMAIL_URL}</Text>
            </Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    card: {
        paddingHorizontal: 5,
        paddingVertical: 25,
    },

    cardText: {
        color: colorTheme.textLight,
        ...fonts.semiBold,
    },

    buttonContainer: {
        marginHorizontal: 0,
        marginTop: 15,
    },

    buttonText: {
        textTransform: "none",
        fontSize: 18,
        letterSpacing: 0.5,
    },

    footerText: {
        color: colorTheme.primary,
        marginTop: 15,
        marginHorizontal: 40,
        textAlign: "center",
    },
})
