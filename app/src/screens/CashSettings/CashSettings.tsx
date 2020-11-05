import React from "react"
import { View, StyleSheet } from "react-native"
import { Button, Text } from "react-native-elements"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"

export function CashSettingsScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text h2 style={{ marginBottom: 15 }}>
                    Add money
                </Text>

                <Text style={styles.cardText}>NGN 20,000</Text>

                <Button
                    containerStyle={styles.buttonContainer}
                    titleStyle={styles.buttonText}
                    icon={{ name: "plus", type: "feather", color: colorTheme.white, size: 20 }}
                    title="Add money"
                />
            </View>

            {/* take out money card */}
            <View style={styles.card}>
                <Text h2 style={{ marginBottom: 15 }}>
                    Take out money
                </Text>

                <Text style={styles.cardText}>Mohammed Mukhtar</Text>
                <Text style={styles.cardText}>Ecobank</Text>
                <Text style={styles.cardText}>04132546783</Text>

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
                    />
                </View>
            </View>

            <Text style={styles.footerText}>Need help? Send an email to team@usebeam.com</Text>
        </View>
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
        marginBottom: 50,
        borderRadius: 20,
        elevation: 5,
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
        ...fonts.semiBold,
    },
})
