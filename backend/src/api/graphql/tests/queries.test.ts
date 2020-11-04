import User from "models/users"
import Transaction from "models/transactions"
import mongoose from "mongoose"
import { gql } from "apollo-server-express"
import { createTestClient } from "apollo-server-testing"
import { constructTestServer } from "./__utils"

describe("Query", () => {
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

    test("me", async () => {
        const server = constructTestServer({
            context: async () => ({
                currentUser: await new User({ phoneNumber: "+2349087573383" }).save(),
            }),
        })

        const { query } = createTestClient(server)

        const response = await query({
            query: gql`
                query Me {
                    me {
                        phoneNumber
                        isNewAccount
                        accountBalance
                        accountSetupState
                    }
                }
            `,
        })

        expect(response.errors).toBeUndefined()
        expect(response.data?.me.isNewAccount).toBeTruthy()
        expect(response.data?.me.accountBalance).toBe(null)
        expect(response.data?.me.phoneNumber).toBe("+2349087573383")
        expect(response.data?.me.accountSetupState).toBe("SET_PIN")
    })

    test.only("transactionHistory", async () => {
        const currentUser = await new User({ phoneNumber: "+2349087573383" }).save()
        const user1 = await new User({ phoneNumber: "+2349087573393" }).save()
        const user2 = await new User({ phoneNumber: "+2349087573313" }).save()
        const user3 = await new User({ phoneNumber: "+2349087573323" }).save()

        // create test transactions
        await new Transaction({
            transactionId: "transaction1",
            amount: 3017.16,
            fees: 17.16,
            from: user1,
            to: currentUser,
        }).save()

        await new Transaction({
            transactionId: "transaction2",
            amount: 3017.16,
            fees: 17.16,
            from: currentUser,
            to: user1,
        }).save()

        await new Transaction({
            transactionId: "transaction3",
            amount: 3017.16,
            fees: 17.16,
            fromFlutterWave: true,
            to: currentUser,
        }).save()

        await new Transaction({
            transactionId: "transaction4",
            amount: 3017.16,
            fees: 17.16,
            from: user2,
            to: user3,
        }).save()

        // setup test
        const server = constructTestServer({
            context: async () => ({ currentUser }),
        })

        const { query } = createTestClient(server)

        const response = await query({
            query: gql`
                query TransactionHistory {
                    transactionHistory {
                        id
                        transactionId
                        transactionType
                        between {
                            phoneNumber
                        }
                        amount
                        createdAt
                    }
                }
            `,
        })

        expect(response.errors).toBeUndefined()
        expect(response.data?.transactionHistory).toHaveLength(3)

        expect(response.data?.transactionHistory[0].transactionType).toBe("CREDIT")
        expect(response.data?.transactionHistory[0].between.phoneNumber).toBe("+2349087573393")
        expect(response.data?.transactionHistory[0].amount).toBe(3000)

        expect(response.data?.transactionHistory[1].transactionType).toBe("DEBIT")

        expect(response.data?.transactionHistory[2].between).toBe(null)
    })

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase()
        await mongoose.disconnect()
    })
})
