import User from "models/users"
import mongoose from "mongoose"
import {
    addMoney,
    setPin,
    storeAccountDetails,
    transferMoney,
    withdrawMoney,
} from "controllers/users"
import { storeTransaction } from "services/transactions"

jest.mock("services/transactions", () => ({
    storeTransaction: jest.fn(() => Promise.resolve({})),
}))

describe("User controller test", () => {
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
        const currentUser = new User({ phoneNumber: "+2349087573381" })
        const resp = await setPin({ pin: "2020" }, currentUser)

        expect(resp?.success).toBeTruthy()
        expect(resp?.user?.pin).toBeDefined()
    })

    test("addMoney", async () => {
        const currentUser = new User({ phoneNumber: "+2349087573383" })
        const data = {
            tx_id: "123456",
            tx_ref: "a-ref-1234",
            amount: 3000,
        }

        const resp = await addMoney(data, currentUser)

        expect(resp?.success).toBeTruthy()
        expect(resp?.user?.accountBalance).toBe(3000)

        // @ts-ignore
        const txData = storeTransaction.mock.calls[0][0]

        expect(txData).toMatchObject({
            transaction_id: "123456",
            amountPaid: 3000,
            amountRecieved: 3017.16,
            fromFlutterWave: true,
        })
    })

    test("transferMoney", async () => {
        expect.assertions(2)

        // with no user
        const currentUser = new User({ phoneNumber: "+2349087573381", accountBalance: 550 })
        const data = { amount: 500, receiverNumber: "+2349087573383" }

        const resp = await transferMoney(data, currentUser)

        expect(resp?.success).toBeTruthy()
        expect(resp?.user?.accountBalance).toBe(45)
    })

    test("transferMoney - error", async () => {
        expect.assertions(2)

        // with no user
        const currentUser = new User({ phoneNumber: "+2349087573381", accountBalance: 450 })
        const data = { amount: 500, receiverNumber: "+2349087573383" }

        const resp = await transferMoney(data, currentUser)

        expect(resp?.success).toBeFalsy()
        expect(resp?.responseMessage).toBe("Insufficient funds")
    })

    test("storeAccountDetails", async () => {
        const currentUser = new User({ phoneNumber: "+2349087573381" })
        const resp = await storeAccountDetails(
            { accNumber: "0123456789", bankCode: "123", bankName: "GTBank Plc" },
            currentUser
        )

        expect(resp?.success).toBeTruthy()
        expect(resp?.user?.bankDetails).toMatchObject({
            accountNumber: "0123456789",
            bankCode: "123",
            bankName: "GTBank Plc",
        })
    })

    test("withdrawMoney", async () => {
        const currentUser = new User({ phoneNumber: "+2349087573381", accountBalance: 200 })
        const resp = await withdrawMoney(currentUser)

        expect(resp?.success).toBeTruthy()
        expect(resp?.user?.accountBalance).toBe(0)
    })

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
