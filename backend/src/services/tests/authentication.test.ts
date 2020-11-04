import User from "models/users"
import mongoose from "mongoose"
import { findOrCreateUserAccount, findAndVerifyAccount } from "services/authentication"

describe("Auth service tests", () => {
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

    test("findOrCreateUserAccount", async () => {
        const { user, token } = await findOrCreateUserAccount("+2349087573383", "090101")

        expect(user._id).toBeDefined()
        expect(user.phoneNumber).toBe("+2349087573383")
        expect(token).toBe("token")
    })

    describe("findAndVerifyAccount", () => {
        beforeEach(async () => {
            await new User({ phoneNumber: "+2349087573383", pin: "2020" }).save()
        })

        test("should work correctly", async () => {
            const resp1 = await findAndVerifyAccount("+2349087573383", "2020")

            expect(resp1.user?._id).toBeDefined()
            expect(resp1.user?.phoneNumber).toBe("+2349087573383")
            expect(resp1.token).toBe("token")
        })

        test("test wrong phone number", async () => {
            try {
                await findAndVerifyAccount("+2349087573393", "2020")
            } catch (e) {
                expect(e).toBeDefined()
            }
        })

        test("test wrong pin", async () => {
            try {
                await findAndVerifyAccount("+2349087573383", "2021")
            } catch (e) {
                expect(e).toBeDefined()
            }
        })

        afterEach(async () => {
            await User.deleteMany({})
        })
    })

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
