import React, { useState } from "react"
import { AddMoneyScreen } from "./AddMoney"

export type Amounts = "500" | "1500" | "3000"
export function AddMoney() {
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState<Amounts>("500")

    const onContinue = () => {
        console.log("Redirect user to page to pay ", amount)
    }

    return (
        <AddMoneyScreen
            loading={loading}
            selectedAmount={amount}
            onSelectAmount={setAmount}
            onContinue={onContinue}
        />
    )
}
