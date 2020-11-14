import { onFailedWithdrawal } from "controllers/webhooks"
import Transaction from "models/transactions"
import User from "models/users"
import mongoose from "mongoose"

describe("Test flutterwave webhook", () => {
    let res: any
    let req: any

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

    beforeEach(async () => {
        // create test user
        const currentUser = await new User({
            phoneNumber: "+2349087573383",
            accountBalance: 0,
        }).save()

        // create test transaction
        await new Transaction({
            transactionId: "transaction1",
            amount: 1500,
            fees: 11,
            from: currentUser,
            toBank: "GTBank Plc - 0123456789",
        }).save()
    })

    test("successful withdrawal", async () => {
        // mock req and res
        req = {
            headers: { "verif-hash": "a-hash" },
            body: {
                data: {
                    status: "SUCCESSFUL",
                    complete_message: "Successful",
                },
            },
        }

        res = {
            sendStatus: jest.fn(),
        }

        await onFailedWithdrawal(req, res)
        expect(res.sendStatus).toBeCalledWith(200)
    })

    test("failed withdrawal", async () => {
        // mock req and res
        req = {
            headers: { "verif-hash": "a-hash" },
            body: {
                data: {
                    status: "FAILED",
                    complete_message: "Failed",
                    reference: "transaction1",
                },
            },
        }

        res = {
            sendStatus: jest.fn(),
        }

        await onFailedWithdrawal(req, res)

        const user = await User.findOne({ phoneNumber: "+2349087573383" })

        expect(user?.accountBalance).toBe(1500)
        expect(res.sendStatus).toBeCalledWith(200)
    })

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()

        res = undefined
        req = undefined
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
