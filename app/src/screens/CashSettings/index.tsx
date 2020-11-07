import { gql, useQuery } from "@apollo/client"
import React from "react"
import { Alert } from "react-native"
import { CashSettingsScreen } from "./CashSettings"

export const GET_CASH_DETAILS = gql`
    query CashDetails {
        me {
            id
            accountBalance
            bankDetails {
                accountNumber
                bankName
            }
        }
    }
`

export function CashSettings() {
    const { data, loading } = useQuery(GET_CASH_DETAILS)

    const onWithdraw = () => {
        Alert.alert("Confirm!", "Are you sure you want to withdraw all your funds?", [
            { text: "Cancel" },
            { text: "OK", onPress: () => console.log("withdraw") },
        ])
    }

    return (
        <CashSettingsScreen
            accountBalance={loading ? 0 : data?.me?.accountBalance}
            bankDetails={loading ? null : data?.me?.bankDetails}
            onWithdraw={onWithdraw}
        />
    )
}
