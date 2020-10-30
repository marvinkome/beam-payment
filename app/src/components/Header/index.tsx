import React from "react"
import BeamLogo from "assets/images/beam-logo-dark.svg"
import Coin from "assets/icons/coin.svg"
import { View, StyleSheet } from "react-native"
import { StackHeaderProps } from "@react-navigation/stack"
import { Text } from "react-native-elements"
import { colorTheme } from "styles/theme"
import { fonts } from "styles/fonts"

// { navigation, previous }: StackHeaderProps
export function Header() {
    return (
        <View style={styles.header}>
            <BeamLogo width={100} />

            <View style={styles.accountBalance}>
                <Coin width={20} />

                <Text testID="accountBalance" h3 style={styles.accountBalanceText}>
                    0
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 20,
    },

    accountBalance: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colorTheme.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5,
    },

    accountBalanceText: {
        ...fonts.semiBold,
        marginLeft: 10,
    },
})
