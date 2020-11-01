import mongoose from "mongoose"
import { findOrCreateUserAccount } from "services/authentication"

describe("Auth service tests", () => {
    beforeAll(async () => {
        await mongoose.connect(
            process.env.MONGO_URL || "",
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
            (err) => {
                if (err) {
                    console.error(err)
                    process.exit(1)
                }
            }
        )
    })

    test("findOrCreateUserAccount", async () => {
        const { user, token } = await findOrCreateUserAccount("+2349087573383", "090101")

        expect(user._id).toBeDefined()
        expect(user.phoneNumber).toBe("+2349087573383")
        expect(token).toBe("token")
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
