export function renderInitialScreen(userBalance: string) {
    return `CON You have ${userBalance} naira in your account.

    1. Withdraw money
    2. Change account details
    3. Change pin
    `
}

export function renderPinToSend(userBalance: string, accountNumber: string, bankName: string) {
    return `CON Enter your pin to send ${userBalance} naira to ${accountNumber} - ${bankName}`
}

export function renderIncorrectPin() {
    return `END Incorrect pin. Try again`
}

export function renderChoosePin() {
    return "CON Choose a pin to continue:"
}

export function renderEnterOld() {
    return "CON Enter old pin:"
}

export function renderEnterAccountNumber() {
    return `CON Enter your account number:
        Your money will be sent to this account when you withdraw.
    `
}

export function renderChooseBank(banks: { name: string; code: string }[], more?: boolean) {
    return `CON Choose your bank: 

        ${banks.map((bank, index) => `${index + 1}. ${bank.name}`).join("\n")}
        ${more ? "9. More" : ""}
    `
}

export function savedAccountDetails() {
    return "END Account details have been changed"
}

export function renderTransferredMoney() {
    return "END All your money has been sent to your bank account. You'll receive a credit alert shortly."
}

export function renderTransferError() {
    return "END Something went wrong during withdraw. Please change your bank details and try again."
}
