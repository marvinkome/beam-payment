import User from "models/users"
import mongoose from "mongoose"
import { setUserPin, addMoneyToAccount } from "services/user"

describe("User service tests", () => {
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

    test("setPin", async () => {
        const user = await setUserPin("1234", new User({ phoneNumber: "+2349087573383" }))
        expect(user.pin).toBeDefined()
    })

    test("addMoneyToAccount", async () => {
        const user = await addMoneyToAccount(500, new User({ phoneNumber: "+2349087573383" }))

        expect(user.accountBalance).toBe(500)
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
