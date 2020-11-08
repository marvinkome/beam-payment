import React, { useState } from "react"
import { gql, useMutation } from "@apollo/client"
import { escapePhoneNumber } from "libs/helpers"
import { Alert } from "react-native"
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

            try {
                const transferMoneyResp = await transferMoney({
                    variables: {
                        amount: parseInt(amount, 10),
                        receiverNumber: escapedNumber,
                    },
                })

                const { success, responseMessage } = transferMoneyResp?.data?.transferMoney

                if (!success) {
                    setTransferingMoney(false)
                    return Alert.alert("Error!", responseMessage)
                }

                setTransferingMoney(false)
                Alert.alert("Success!", `Money has been sent to ${escapedNumber}`)
                return true
            } catch (err) {
                setTransferingMoney(false)
                return Alert.alert("Error!", `Failed to transfer money to ${escapedNumber}`)
            }
        },
    }
}

export function Transfer() {
    const [amount, setAmount] = useState("")
    const [receiverNumber, setReceiverNumber] = useState("")
    const { transferingMoney, transferMoney } = useTransferMoney()

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
