import User from "models/users"
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
        expect(response.data?.me.accountSetupState).toBe("SET_PIN")
    })

    afterAll(async () => {
        await User.deleteMany({})
        await mongoose.disconnect()
    })
})
