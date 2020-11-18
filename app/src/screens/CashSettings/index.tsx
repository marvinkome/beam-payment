import React, { useCallback, useState } from "react"
import * as Sentry from "@sentry/react-native"
import { Alert } from "react-native"
import { gql, useMutation, useQuery } from "@apollo/client"
import { CashSettingsScreen } from "./CashSettings"
import { formatCurrency, getWithdrawFee } from "libs/helpers"
import { useFocusEffect } from "@react-navigation/native"
import { trackEvent } from "libs/analytics"

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

export const WITHDRAW_MONEY = gql`
    mutation WithdrawMoney {
        withdrawMoney {
            success
            responseMessage
            user {
                id
                accountBalance
            }
        }
    }
`

function useWithdraw() {
    const [withdrawingMoney, setWithdrawingMoney] = useState(false)
    const [withdrawMoney] = useMutation(WITHDRAW_MONEY)

    return {
        withdrawingMoney,
        withdrawMoney: async () => {
            setWithdrawingMoney(true)

            try {
                const withdrawMoneyResp = await withdrawMoney()

                const { success, responseMessage } = withdrawMoneyResp?.data?.withdrawMoney
                setWithdrawingMoney(false)

                if (!success) {
                    Sentry.captureMessage(responseMessage)
                    return Alert.alert("Error!", responseMessage)
                }

                trackEvent("Withdraw money from account")
                Alert.alert("Success!", "Money has been sent to your bank account")
            } catch (err) {
                Sentry.captureException(err)
                setWithdrawingMoney(false)
                return Alert.alert("Error!", "Failed to withdraw money")
            }
        },
    }
}

export function CashSettings() {
    const { data, loading, refetch } = useQuery(GET_CASH_DETAILS)
    const { withdrawMoney, withdrawingMoney } = useWithdraw()

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, []),
    )

    const onWithdraw = () => {
        if (!data?.me?.bankDetails.accountNumber || !data?.me?.bankDetails.bankName) {
            return Alert.alert("Error", "Please set bank details to be able to withdraw funds")
        }

        const accountBalance = data?.me?.accountBalance
        const bankDetails = data?.me?.bankDetails

        // Send NGN5000 to 0123456789 - GTBank Plc? NGN26.78 withdrawal fee.
        const alertMsg = `Send NGN${formatCurrency(parseInt(accountBalance, 10))} to ${
            bankDetails?.accountNumber
        } - ${bankDetails?.bankName}? NGN${getWithdrawFee(
            parseInt(accountBalance, 10),
        )} withdrawal fee.`

        Alert.alert("Confirm", alertMsg, [
            { text: "Cancel" },
            { text: "Confirm", onPress: () => withdrawMoney() },
        ])
    }

    return (
        <CashSettingsScreen
            accountBalance={data?.me?.accountBalance}
            bankDetails={loading ? null : data?.me?.bankDetails}
            onWithdraw={onWithdraw}
            withdrawing={withdrawingMoney}
        />
    )
}
