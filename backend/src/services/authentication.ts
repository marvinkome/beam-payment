import User from "models/users"
import { generateToken } from "libs/auth"

export async function createUserAccount(phoneNumber: string, firebaseToken?: string) {
    const user = new User()

    user.phoneNumber = phoneNumber
    user.firebaseId = firebaseToken

    await user.save()

    return { user, token: generateToken(user) }
}
