import Flutterwave from "loaders/flutterwave"
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

    test("add money - international payments", async () => {
        Flutterwave.Transaction.verify.mockImplementationOnce(() => {
            const amount = 3060
            const percentageFee = parseFloat((3.8 / 100).toFixed(3))
            const app_fee = amount * percentageFee

            return Promise.resolve({
                status: "success",
                message: "Transaction fetched successfully",
                data: {
                    id: "123456",
                    tx_ref: "a-ref-1234",
                    status: "successful",
                    currency: "NGN",
                    amount,
                    app_fee,
                    amount_settled: amount - app_fee,
                },
            })
        })

        const data = {
            tx_id: "123456",
            tx_ref: "a-ref-1234",
            amount: 3000,
        }

        const user = await userService?.addMoney(data)
        expect(user?.accountBalance).toBe(3543)
    })

    test.skip("transferMoneyToAccount - with error", async () => {
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

    test.skip("transferMoneyToAccount - with sms", async () => {
        const receiver = new User({ phoneNumber: "+2349087573383" })

        const data = await userService?.transferMoneyToAccount(500, receiver)
        expect(data?.user?.accountBalance).toBe(95)
        expect(receiver.accountBalance).toBe(500)
    })

    test.skip("transferMoneyToAccount - small amount - with sms", async () => {
        const receiver = new User({ phoneNumber: "+2349087573383" })

        const data = await userService?.transferMoneyToAccount(0.3, receiver)
        expect(data?.user?.accountBalance).toBe(594.7)
        expect(receiver.accountBalance).toBe(0.3)
    })

    test.skip("transferMoneyToAccount - with token", async () => {
        const receiver = new User({
            phoneNumber: "+2349087573383",
            notificationToken: "notif-token",
        })

        const data = await userService?.transferMoneyToAccount(500, receiver)

        expect(data?.user?.accountBalance).toBe(100)
        expect(receiver.accountBalance).toBe(500)
    })

    test.skip("transferMoneyToAccount - with small amount - with token", async () => {
        const receiver = new User({
            phoneNumber: "+2349087573383",
            notificationToken: "notif-token",
        })

        const data = await userService?.transferMoneyToAccount(0.3, receiver)

        expect(data?.user?.accountBalance).toBe(599.7)
        expect(receiver.accountBalance).toBe(0.3)
    })

    test.skip("storeAccountDetails", async () => {
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

    test.skip("withdrawMoney", async () => {
        const user = await userService?.withdrawMoney()
        const transaction = await Transaction.findOne({ from: user?.id })

        expect(transaction?.amount).toBe(600)
        expect(transaction?.fees).toBe(11)
        expect(user?.accountBalance).toBe(0)
    })

    test.skip("withdrawMoney - small amount", async () => {
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
            amount: 3000,
            fees: 11,
        })

        const user = await userService?.revertTransaction(transaction)

        const reversalTransaction = await Transaction.findOne({ to: user?.id, reversed: true })

        expect(user?.accountBalance).toBe(3600)
        expect(reversalTransaction?.feeType).toBe("REVERSAL")
    })

    test("addReferralMoney", async () => {
        const user = await userService?.addReferralMoney()
        expect(user?.accountBalance).toBe(700)
    })

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
