import User from "models/users"
import { generateToken } from "libs/auth"

export async function findOrCreateUserAccount(phoneNumber: string, firebaseToken?: string) {
    let user = await User.findOne({ phoneNumber })
    let isCreated = false

    if (!user) {
        user = new User()
        user.phoneNumber = phoneNumber
        user.firebaseId = firebaseToken

        await user.save()
        isCreated = true
    }

    return { user, token: generateToken(user), isCreated }
}

export async function findAndVerifyAccount(phoneNumber: string, pin: string) {
    const user = await User.findOne({ phoneNumber })

    if (!user || !(await user.verify_pin(pin))) {
        return { error: "Invalid pin" }
    }

    return { user, token: generateToken(user) }
}
