import Transaction from "models/transactions"
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

    test("transferMoneyToAccount - small amount - with sms", async () => {
        const receiver = new User({ phoneNumber: "+2349087573383" })

        const user = await userService?.transferMoneyToAccount(0.3, receiver)
        expect(user?.accountBalance).toBe(594.7)
        expect(receiver.accountBalance).toBe(0.3)
    })

    test("transferMoneyToAccount - with token", async () => {
        const receiver = new User({
            phoneNumber: "+2349087573383",
            notificationToken: "notif-token",
        })

        const user = await userService?.transferMoneyToAccount(500, receiver)

        expect(user?.accountBalance).toBe(100)
        expect(receiver.accountBalance).toBe(500)
    })

    test("transferMoneyToAccount - with small amount - with token", async () => {
        const receiver = new User({
            phoneNumber: "+2349087573383",
            notificationToken: "notif-token",
        })

        const user = await userService?.transferMoneyToAccount(0.3, receiver)

        expect(user?.accountBalance).toBe(599.7)
        expect(receiver.accountBalance).toBe(0.3)
    })

    test("storeAccountDetails", async () => {
        const user = await userService?.storeAccountDetails({
            accNumber: "1234567890",
            bankName: "GTBank Plc",
            bankCode: "123",
        })

        expect(user?.bankDetails).toMatchObject({
            accountNumber: "1234567890",
            bankName: "GTBank Plc",
            bankCode: "123",
        })
    })

    test("withdrawMoney", async () => {
        const user = await userService?.withdrawMoney()
        const transaction = await Transaction.findOne({ from: user?.id })

        expect(transaction?.amount).toBe(600)
        expect(transaction?.fees).toBe(11)
        expect(user?.accountBalance).toBe(0)
    })

    test("withdrawMoney - small amount", async () => {
        userService = new UserService(
            new User({ phoneNumber: "+2349087573383", accountBalance: 10 })
        )

        try {
            await userService?.withdrawMoney()
        } catch (err) {
            expect(err.message).toBe("You must have more than NGN100 to withdraw")
        }
    })

    test("revertTransaction", async () => {
        const transaction = new Transaction({
            transactionId: "a-transaction",
            amount: 2985,
            fees: 15,
        })

        const user = await userService?.revertTransaction(transaction)
        expect(user?.accountBalance).toBe(3000)
    })

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
