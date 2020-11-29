import config from "config"
import mongoose from "mongoose"
import User from "models/users"
import { authenticateUser } from "controllers/authentication"
import { findOrCreateUserAccount } from "services/authentication"

jest.mock("services/authentication", () => ({
    findOrCreateUserAccount: jest.fn(() =>
        Promise.resolve({
            user: { id: 0, phoneNumber: "+2349087573383" },
            token: "token",
        })
    ),
}))

describe("Auth controller test", () => {
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

    test("authenticateUser", async () => {
        const resp = await authenticateUser({ idToken: "token" })

        expect(resp.success).toBeTruthy()
        expect(resp.user?.phoneNumber).toBe("+2349087573383")
        expect(resp.token).toBe("token")
    })

    test("authenticateUser - with referral", async () => {
        // @ts-ignore
        findOrCreateUserAccount.mockImplementationOnce(() =>
            Promise.resolve({
                user: { id: 0, phoneNumber: "+2349087573383" },
                token: "token",
                isCreated: true,
            })
        )

        await new User({ phoneNumber: "+2349087573389" }).save()

        const resp = await authenticateUser({ idToken: "token", referedBy: "+2349087573389" })

        expect(resp.success).toBeTruthy()
        expect(resp.user?.phoneNumber).toBe("+2349087573383")
        expect(resp.token).toBe("token")

        const referringUser = await User.findOne({ phoneNumber: "+2349087573389" })
        expect(referringUser?.accountBalance).toBe(config.referralFee)
    })

    afterEach(async () => {
        await mongoose.connection?.db?.dropDatabase()
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
