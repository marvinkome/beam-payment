import { makeVar } from "@apollo/client"
import { FirebaseAuthTypes } from "@react-native-firebase/auth"

export interface SmsConfirmation {
    confirmation: FirebaseAuthTypes.ConfirmationResult | null
    phoneNumber: string | null
}

export const smsConfirmationObj = makeVar<SmsConfirmation>({
    confirmation: null,
    phoneNumber: null,
})

export const authToken = makeVar<string>("")
