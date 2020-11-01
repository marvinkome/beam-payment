import { IUser } from "models/users"

export function setUserPin(pin: string, user: IUser) {
    user.pin = pin
    return user.save()
}

export function addMoneyToAccount(amount: number, user: IUser) {
    user.accountBalance = (user.accountBalance || 0) + amount
    return user.save()
}
