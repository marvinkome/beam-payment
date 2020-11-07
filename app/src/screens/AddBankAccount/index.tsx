import React, { useState } from "react"
import { Alert } from "react-native"
import { AddBackAccountScreen } from "./AddBankAccount"
import { gql, useMutation } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"

export const ADD_BANK_ACCOUNT = gql`
    mutation SaveBankDetails($data: AccountDetailsInput!) {
        saveBankDetails(data: $data) {
            success
            responseMessage
            user {
                id
                bankDetails {
                    accountNumber
                    bankName
                }
            }
        }
    }
`

function useAddBankAccount() {
    const [addingAccount, setAddingAccount] = useState(false)
    const [addBankAccount] = useMutation(ADD_BANK_ACCOUNT)
    const navigation = useNavigation()

    return {
        addingAccount,
        addBankAccount: async (accNumber: string, bank: { code: string; name: string }) => {
            setAddingAccount(true)

            try {
                const addBankAccountResp = await addBankAccount({
                    variables: {
                        data: {
                            accNumber,
                            bankCode: bank.code,
                            bankName: bank.name,
                        },
                    },
                })

                const { success, responseMessage } = addBankAccountResp?.data?.saveBankDetails
                setAddingAccount(false)

                if (!success) {
                    return Alert.alert("Error!", responseMessage)
                }

                // handle redirect
                navigation.goBack()
            } catch (err) {
                console.log(err)
                setAddingAccount(false)
                return Alert.alert("Error!", "Failed to save bank details")
            }
        },
    }
}

type PickerValue = { Name: string; Value: string; Id: string }
export function AddBankAccount() {
    const [accountNumber, setAccountNumber] = useState("")
    const [bank, setBank] = useState<PickerValue | null>(null)
    const { addingAccount, addBankAccount } = useAddBankAccount()

    const onContinue = async () => {
        await addBankAccount(accountNumber, { code: bank?.Value || "", name: bank?.Name || "" })
    }

    return (
        <AddBackAccountScreen
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            bank={bank}
            setBank={setBank}
            loading={addingAccount}
            onContinue={onContinue}
        />
    )
}
