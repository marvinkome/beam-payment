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
    if (amount <= 5000) {
        return WITHDRAWAL_FEE[0]
    }

    if (amount <= 50000) {
        return WITHDRAWAL_FEE[1]
    }

    return WITHDRAWAL_FEE[2]
}

export function isFalsy(value: any) {
    return value === null && value === undefined
}

export function isPhoneNumber(value: string) {
    return /^(\+234|[0])([7-9][0])\d{8}$/.test(value)
}
