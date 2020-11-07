import React, { useState } from "react"
import { AddBackAccountScreen } from "./AddBankAccount"
import { Alert } from "react-native"

type PickerValue = { Name: string; Value: string; Id: string }
export function AddBankAccount() {
    const [accountNumber, setAccountNumber] = useState("")
    const [bank, setBank] = useState<PickerValue | null>(null)

    return (
        <AddBackAccountScreen
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            bank={bank}
            setBank={setBank}
            onContinue={() => null}
        />
    )
}
