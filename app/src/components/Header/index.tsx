import React from "react"
import BeamLogo from "assets/images/beam-logo-dark.svg"
import Coin from "assets/icons/coin.svg"
import { gql, useQuery } from "@apollo/client"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { StackHeaderProps } from "@react-navigation/stack"
import { Text, Icon } from "react-native-elements"
import { colorTheme } from "styles/theme"
import { fonts } from "styles/fonts"
import { formatCurrency } from "libs/helpers"
import { routes } from "libs/navigator"

export const GET_ACCOUNT_BALANCE = gql`
    query AccountBalance {
        me {
            id
            accountBalance
        }
    }
`
function useAccountBalance() {
    return useQuery(GET_ACCOUNT_BALANCE)
}

export function Header({ navigation, previous }: StackHeaderProps) {
    const { loading, data } = useAccountBalance()

    return (
        <View style={styles.header}>
            {previous ? (
                <Icon name="arrow-left" type="feather" size={30} onPress={navigation.goBack} />
            ) : (
                <BeamLogo width={100} />
            )}

            <TouchableOpacity onPress={() => navigation.navigate(routes.main.cashSettings)}>
                <View style={styles.accountBalance}>
                    <Coin width={20} />

                    <Text testID="accountBalance" h3 style={styles.accountBalanceText}>
                        {loading || !data?.me?.accountBalance
                            ? 0
                            : formatCurrency(data?.me?.accountBalance)}
                    </Text>
                </View>
            </TouchableOpacity>
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
