import { getTokenFromHeaders, getUserFromToken } from "../auth"

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
            const res = await getUserFromToken("")
            expect(res).toBe(null)
        })
    })
})
