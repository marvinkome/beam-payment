import User from "models/users"
import { generateToken } from "libs/auth"

export async function findOrCreateUserAccount(phoneNumber: string, firebaseToken?: string) {
    let user = await User.findOne({ phoneNumber })
    let isNewAccount = false

    if (!user) {
        user = new User()
        user.phoneNumber = phoneNumber
        user.firebaseId = firebaseToken

        await user.save()

        isNewAccount = true
    }

    return { user, token: generateToken(user), isNewAccount }
}
