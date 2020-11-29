import config from "config"

export function getAmountToWithdraw(amount: number) {
    if (amount < config.transactionFees.withdrawFee[0]) {
        return null
    }

    if (amount <= 5000) {
        return amount - config.transactionFees.withdrawFee[0]
    }

    if (amount <= 50000) {
        return amount - config.transactionFees.withdrawFee[1]
    }

    return amount - config.transactionFees.withdrawFee[2]
}

export function formatCurrency(number: number) {
    return new Intl.NumberFormat().format(number)
}

export function capitalize(str: string) {
    return str
        .toLowerCase()
        .split("")
        .map((i, idx) => (idx === 0 ? i.toUpperCase() : i))
        .join("")
}
