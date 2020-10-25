import { makeVar } from "@apollo/client"
import { FirebaseAuthTypes } from "@react-native-firebase/auth"

export interface SmsConfirmation {
    confirmation: FirebaseAuthTypes.PhoneAuthSnapshot | null
    phoneNumber: string | null
}

export const smsConfirmationObj = makeVar<SmsConfirmation>({
    confirmation: null,
    phoneNumber: null,
})
