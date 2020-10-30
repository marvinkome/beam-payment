export function escapePhoneNumber(number: string) {
    return number[0] === "0" ? number.slice(1) : number
}

export function formatCurrency(number: number) {
    return new Intl.NumberFormat().format(number)
}
