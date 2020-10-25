import React from "react"
import { render } from "@testing-library/react-native"
import { SetPinScreen } from "./SetPin"

describe("SetPin page tests", () => {
    test("SetPinScreen", () => {
        const queries = render(<SetPinScreen />)

        expect(queries.getByTestId("codeInput")).toBeTruthy()
        expect(queries.getByText("Continue")).toBeTruthy()
    })
})
