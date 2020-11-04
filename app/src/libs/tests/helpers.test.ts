import mockdate from "mockdate"
import { escapePhoneNumber, parsePhoneNumber, formatDate } from "../helpers"

describe("helpers", () => {
    beforeEach(() => {
        mockdate.set(1604507740641)
    })

    test("escapePhoneNumber", () => {
        expect(escapePhoneNumber("070372707838")).toEqual("70372707838")
    })

    test("parsePhoneNumber", () => {
        expect(parsePhoneNumber("+23470372707838")).toEqual("070372707838")
    })

    test("formatDate", () => {
        expect(formatDate("1604492640000")).toEqual("01:24 PM")
        expect(formatDate("1601814240000")).toEqual("04/10/2020")
    })

    afterEach(() => {
        mockdate.reset()
    })
})
