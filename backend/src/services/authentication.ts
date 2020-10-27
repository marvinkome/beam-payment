import User from "models/users"

export async function createUserAccount(phoneNumber: string, firebaseId?: string) {
    const user = new User()

    user.phoneNumber = phoneNumber
    user.firebaseId = firebaseId

    return user.save()
}
