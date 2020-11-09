import config from "config"

export function getAmountToWithdraw(amount: number) {
    if (amount <= 5000) {
        return amount - config.transactionFees.withdrawFee[0]
    }

    if (amount <= 50000) {
        return amount - config.transactionFees.withdrawFee[1]
    }

    return amount - config.transactionFees.withdrawFee[2]
}
