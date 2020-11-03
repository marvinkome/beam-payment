import { Schema, Document, model } from "mongoose"
import { hash, compare } from "bcrypt"

export interface IUser extends Document {
    phoneNumber: string
    firebaseId?: string // only available if user signed up using firebase number verification
    pin?: string
    accountBalance?: number
    notificationToken?: string
    verify_pin: (pin: string) => Promise<boolean>
}

const userSchema: Schema<IUser> = new Schema(
    {
        phoneNumber: {
            type: String,
            maxlength: 14,
        },

        accountBalance: {
            min: 0,
            type: Number,
        },

        firebaseId: String,
        pin: String,
        notificationToken: String,
    },
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("pin")) {
        return next()
    }

    const currentThis = this as IUser

    if (!currentThis.pin) {
        return next()
    }

    const pinHash = await hash(currentThis.pin, 10)
    currentThis.pin = pinHash

    next()
})

userSchema.methods.verify_pin = function (pin: string) {
    return compare(pin, this.pin!)
}

const User = model<IUser>("User", userSchema)
export default User
