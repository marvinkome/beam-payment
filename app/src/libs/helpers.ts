import dayjs from "dayjs"
import { WITHDRAWAL_FEE } from "./constants"

export function escapePhoneNumber(number: string) {
    return number[0] === "0" ? number.slice(1) : number
}

export function parsePhoneNumber(number: string) {
    if (number.slice(0, 4) === "+234") {
        return `0${number.slice(4, number.length)}`
    }

    return number
}

export function formatCurrency(number: number) {
    return new Intl.NumberFormat().format(number)
}

export function formatDate(date: string) {
    const dayjsDate = dayjs(parseInt(date, 10))

    // if its same day - return time
    if (dayjs().isSame(dayjsDate, "d")) {
        return dayjsDate.format("hh:mm A")
    }

    // else return full date
    return dayjsDate.format("DD/MM/YYYY")
}

export function getWithdrawFee(amount: number) {
    return amount - amount * WITHDRAWAL_FEE
}
