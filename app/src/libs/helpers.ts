export function escapePhoneNumber(number: string) {
    return number[0] === "0" ? number.slice(1) : number
}