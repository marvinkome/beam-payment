import { IUser } from "models/users"

export async function setPin(data: { pin: string }, user: IUser | null) {
    // set pin and return user
    if (!user) {
        return
    }

    user.pin = data.pin

    try {
        await user.save()
        return {
            success: true,
            user,
        }
    } catch (e) {
        return {
            success: false,
            responseMessage: "Error saving pin. Please try again",
        }
    }
}
