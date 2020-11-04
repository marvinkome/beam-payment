import User from "models/users"
import mongoose from "mongoose"
import { UserService } from "services/user"

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

    let userService: UserService | null = null
    beforeEach(() => {
        const user = new User({ phoneNumber: "+2349087573383", accountBalance: 600 })
        userService = new UserService(user)
    })

    test("setPin", async () => {
        const user = await userService?.setPin("1234")
        expect(user?.pin).toBeDefined()
    })

    test("addMoney", async () => {
        const data = {
            tx_id: "123456",
            tx_ref: "a-ref-1234",
            amount: 500,
        }

        const user = await userService?.addMoney(data)

        expect(user?.accountBalance).toBe(1100)
    })

    test("transferMoneyToAccount - with error", async () => {
        expect.assertions(2)
        const service = new UserService(new User({ phoneNumber: "+2349087574483" }))
        const receiver = new User({ phoneNumber: "+2349087573383" })

        try {
            await service?.transferMoneyToAccount(500, receiver)
        } catch (err) {
            expect(err).toBeDefined()
            expect(err.message).toBe("Insufficient funds")
        }
    })

    test("transferMoneyToAccount - with sms", async () => {
        const receiver = new User({ phoneNumber: "+2349087573383" })

        const user = await userService?.transferMoneyToAccount(500, receiver)
        expect(user?.accountBalance).toBe(95)
        expect(receiver.accountBalance).toBe(500)
    })

    test("transferMoneyToAccount - with sms", async () => {
        const receiver = new User({
            phoneNumber: "+2349087573383",
            notificationToken: "notif-token",
        })

        const user = await userService?.transferMoneyToAccount(500, receiver)

        expect(user?.accountBalance).toBe(100)
        expect(receiver.accountBalance).toBe(500)
    })

    afterEach(async () => {
        await User.deleteMany({})
    })

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase()
        await mongoose.disconnect()
    })
})
