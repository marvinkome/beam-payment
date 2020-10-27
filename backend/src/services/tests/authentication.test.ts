import User from "models/users"
import mockingoose from "mockingoose"
import { createUserAccount } from "services/authentication"

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn().mockImplementationOnce(() => "token"),
}))

describe("Auth service tests", () => {
    test("createUserAccount", async () => {
        mockingoose(User).toReturn({
            _id: "507f19",
            phoneNumber: "+2349087573383",
            firebaseId: "090101",
        })

        const { user, token } = await createUserAccount("+2349087573383", "090101")

        expect(user.phoneNumber).toBe("+2349087573383")
        expect(token).toBe("token")
    })
})
