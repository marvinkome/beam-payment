import React, { useEffect, useState } from "react"
import * as Sentry from "@sentry/react-native"
import { useRoute } from "@react-navigation/native"
import { gql, useMutation } from "@apollo/client"
import { escapePhoneNumber } from "libs/helpers"
import { Alert, Vibration } from "react-native"
import { trackEvent } from "libs/analytics"
import { TransferScreen } from "./Transfer"

export const TRANSER_MONEY = gql`
    mutation TransferMoney($amount: Float!, $receiverNumber: String!) {
        transferMoney(amount: $amount, receiverNumber: $receiverNumber) {
            success
            responseMessage
            user {
                id
                accountBalance
            }
        }
    }
`

function useTransferMoney() {
    const [transferingMoney, setTransferingMoney] = useState(false)
    const [transferMoney] = useMutation(TRANSER_MONEY)

    return {
        transferingMoney,
        transferMoney: async (amount: string, receiverNumber: string) => {
            setTransferingMoney(true)
            const escapedNumber = `+234${escapePhoneNumber(receiverNumber)}`
            const newAmount = parseFloat(Number(amount).toPrecision(2))

            if (newAmount < 1) {
                setTransferingMoney(false)
                return Alert.alert("Error", "The amount is too small")
            }

            try {
                const transferMoneyResp = await transferMoney({
                    variables: {
                        amount: newAmount,
                        receiverNumber: escapedNumber,
                    },
                })

                const { success, responseMessage } = transferMoneyResp?.data?.transferMoney

                if (!success) {
                    setTransferingMoney(false)
                    Sentry.captureMessage(responseMessage)
                    return Alert.alert("Error!", responseMessage)
                }

                setTransferingMoney(false)
                trackEvent("Sent money", { to: escapePhoneNumber })

                Vibration.vibrate()
                Alert.alert("Success", `Money has been sent to ${escapedNumber}`)

                return true
            } catch (err) {
                console.log(err)
                Sentry.captureException(err)
                setTransferingMoney(false)
                return Alert.alert("Error!", `Failed to transfer money to ${escapedNumber}`)
            }
        },
    }
}

export function Transfer() {
    const { params } = useRoute()
    const initialPhoneNumber = (params as any)?.phoneNumber

    const [amount, setAmount] = useState("")
    const [receiverNumber, setReceiverNumber] = useState("")
    const { transferingMoney, transferMoney } = useTransferMoney()

    useEffect(() => {
        if (initialPhoneNumber) {
            setReceiverNumber(initialPhoneNumber)
        }
    }, [initialPhoneNumber])

    const onTransferMoney = async () => {
        const success = await transferMoney(amount, receiverNumber)

        if (success) {
            setAmount("")
            setReceiverNumber("")
        }
    }

    return (
        <TransferScreen
            loading={transferingMoney}
            amount={amount}
            receiverNumber={receiverNumber}
            onChangeAmount={setAmount}
            onChangeReceiverNumber={setReceiverNumber}
            onContinue={onTransferMoney}
        />
    )
}
