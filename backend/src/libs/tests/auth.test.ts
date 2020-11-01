import mockingoose from "mockingoose"
import User from "models/users"
import { getTokenFromHeaders, getUserFromToken } from "../auth"

jest.mock("config", () => {
    return {
        jwtSecret: "token-secret",
        logs: {
            level: "silly",
        },
    }
})

const mockAuthHeader = (authorization?: string) => {
    return {
        headers: {
            authorization,
        },
    }
}

describe("Auth lib tests", () => {
    describe("getTokenFromHeaders", () => {
        it("returns null when there's no header", () => {
            const req: any = mockAuthHeader()
            expect(getTokenFromHeaders(req)).toBe(null)
        })

        it("returns token when header is set", () => {
            const req: any = mockAuthHeader("Bearer token")
            expect(getTokenFromHeaders(req)).toBe("token")
        })
    })

    describe("getUserFromToken", () => {
        it("returns null when you send a fake token", async () => {
            mockingoose(User).toReturn({ _id: "user_id" }, "findOne")

            const res = await getUserFromToken("token")
            expect(res).toBeDefined()
        })
    })
})
