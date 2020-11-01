import User from "models/users"
import mongoose from "mongoose"
import { addMoney } from "controllers/users"
import { storeTransaction } from "services/transactions"

jest.mock("services/authentication", () => ({
    findOrCreateUserAccount: jest.fn(() =>
        Promise.resolve({
            user: { id: 0, phoneNumber: "+2349087573383" },
            token: "token",
        })
    ),
}))

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

    test("addMoney", async () => {
        const resp = await addMoney(
            {
                tx_id: "123456",
                tx_ref: "a-ref-1234",
                amount: 3000,
            },
            new User({ phoneNumber: "+2349087573383" })
        )

        expect(resp?.success).toBeTruthy()
        expect(resp?.user?.accountBalance).toBe(3000)

        // @ts-ignore
        const txData = storeTransaction.mock.calls[0][0]

        expect(txData).toMatchObject({
            transaction_id: "123456",
            amountPaid: 3000,
            amountRecieved: 3017.16,
            transactionType: "credit",
            fromFlutterWave: true,
        })
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
