import React from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "react-native-elements"
import { formatCurrency, formatDate, parsePhoneNumber } from "libs/helpers"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"

type IProps = {
    id: string
    amount: number
    between?: string
    type: "debit" | "credit"
    timestamp: string
}
export function HistoryItem(props: IProps) {
    let amountColor = { color: colorTheme.green }
    if (props.type === "debit") {
        amountColor.color = colorTheme.red
    }

    return (
        <View testID="historyItem" style={styles.container}>
            <View style={{ flex: 1 }}>
                <Text
                    accessibilityHint={`${props.type}ed ${props.amount}`}
                    style={{ ...styles.amountText, ...amountColor }}>
                    NGN {formatCurrency(props.amount)}
                </Text>
                {props.between && (
                    <Text style={styles.phoneNumber}>{parsePhoneNumber(props.between)}</Text>
                )}
            </View>

            <Text style={{ color: colorTheme.textLight }}>{formatDate(props.timestamp)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: colorTheme.grey,
    },

    amountText: {
        ...fonts.semiBold,
    },
    phoneNumber: {
        letterSpacing: 0.2,
        marginTop: 10,
    },
})
