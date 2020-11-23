import { TransactionFeeType } from "models/transactions"
import User from "models/users"
import mongoose from "mongoose"
import { storeTransaction } from "services/transactions"

describe("Transactions tests", () => {
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

    test("storeTransaction - Flutterwave transaction", async () => {
        const tx = await storeTransaction({
            transaction_id: "123455",
            amountPaid: 1500,
            amountRecieved: 1508.58,
            fromFlutterWave: true,
            to: new User({ phoneNumber: "+2349087573383" }),
            feeType: TransactionFeeType.DEPOSIT,
        })

        expect(tx.fees).toBe(8.58)
    })

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
