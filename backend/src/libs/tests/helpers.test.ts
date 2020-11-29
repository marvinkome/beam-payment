import { capitalize, getAmountToWithdraw } from "../helpers"

describe("Helpers lib tests", () => {
    test("getAmountToWithdraw", () => {
        expect(getAmountToWithdraw(3000)).toBe(2989)
        expect(getAmountToWithdraw(5000)).toBe(4989)
        expect(getAmountToWithdraw(1030)).toBe(1019)
        expect(getAmountToWithdraw(5500)).toBe(5473)
        expect(getAmountToWithdraw(7000)).toBe(6973)
        expect(getAmountToWithdraw(50000)).toBe(49973)
        expect(getAmountToWithdraw(55000)).toBe(54946)
        expect(getAmountToWithdraw(150000)).toBe(149946)
    })

    test("capitalize", () => {
        expect(capitalize("DEPOSIT")).toBe("Deposit")
        expect(capitalize("WITHDRAWAL")).toBe("Withdrawal")
        expect(capitalize("deposit")).toBe("Deposit")
    })
})
