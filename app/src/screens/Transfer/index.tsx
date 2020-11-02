import React, { useState } from "react"
import { TransferScreen } from "./Transfer"

export function Transfer() {
    const [amount, setAmount] = useState("")
    const [receiverNumber, setReceiverNumber] = useState("")

    const onContinue = () => {}

    return (
        <TransferScreen
            loading={false}
            amount={amount}
            receiverNumber={receiverNumber}
            onChangeAmount={setAmount}
            onChangeReceiverNumber={setReceiverNumber}
            onContinue={onContinue}
        />
    )
}
