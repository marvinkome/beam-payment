import React from "react"
import { render } from "@testing-library/react-native"
import { VerifyPhoneScreen } from "./VerifyPhone"

describe("Verify phone page tests", () => {
    test.skip("Test container", () => {})

    test("Test view component", () => {
        const queries = render(<VerifyPhoneScreen />)

        expect(queries.getByText("Sent code to \n+234913498619")).toBeTruthy()
        expect(queries.getByTestId("codeInput")).toBeTruthy()
        expect(queries.getByText(/Send again/)).toBeTruthy()
        expect(queries.getByText("Continue")).toBeTruthy()
    })
})
