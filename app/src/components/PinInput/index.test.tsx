import React from "react"
import { render } from "@testing-library/react-native"
import { PinInput } from "./index"

describe("PhoneNumberInput", () => {
    it("should container input, icon and text children", () => {
        const queries = render(<PinInput codeLength={5} testID="codeInput" />)
        expect(queries.getAllByTestId("codeInput")).toBeTruthy()
    })
})
