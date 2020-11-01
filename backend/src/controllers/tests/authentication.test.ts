import { authenticateUser } from "controllers/authentication"

jest.mock("services/authentication", () => ({
    findOrCreateUserAccount: jest.fn(() =>
        Promise.resolve({
            user: { id: 0, phoneNumber: "+2349087573383" },
            token: "token",
        })
    ),
}))

describe("Auth controller test", () => {
    test("authenticateUser", async () => {
        const resp = await authenticateUser({ idToken: "token" })

        expect(resp.success).toBeTruthy()
        expect(resp.user?.phoneNumber).toBe("+2349087573383")
        expect(resp.token).toBe("token")
    })
})
