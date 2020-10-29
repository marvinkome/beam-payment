import User from "models/users"
import mockingoose from "mockingoose"
import { findOrCreateUserAccount } from "services/authentication"

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn().mockImplementationOnce(() => "token"),
}))

describe("Auth service tests", () => {
    test("findOrCreateUserAccount", async () => {
        mockingoose(User).toReturn({
            _id: "507f19",
            phoneNumber: "+2349087573383",
            firebaseId: "090101",
        })

        const { user, token, isNewAccount } = await findOrCreateUserAccount(
            "+2349087573383",
            "090101"
        )

        expect(isNewAccount).toBe(true)
        expect(user.phoneNumber).toBe("+2349087573383")
        expect(token).toBe("token")
    })
})
