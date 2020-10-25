import { escapePhoneNumber } from "../helpers"

describe("helpers", () => {
    test("escapePhoneNumber", () => {
        expect(escapePhoneNumber("0703727078383")).toEqual("703727078383")
    })
})
