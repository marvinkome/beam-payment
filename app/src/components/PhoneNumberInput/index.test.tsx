import React from "react"
import { render } from "@testing-library/react-native"
import { PhoneNumberInput } from "./index"

describe("PhoneNumberInput", () => {
    it("should container input, icon and text children", () => {
        let withIcon = true

        const queries = render(<PhoneNumberInput withIcon={withIcon} />)
        expect(queries.getByTestId("countryIcon")).toBeTruthy()
        expect(queries.getByText("+234")).toBeTruthy()
        expect(queries.getByPlaceholderText("Enter phone number")).toBeTruthy()

        withIcon = false
        queries.update(<PhoneNumberInput withIcon={withIcon} />)
        expect(queries.queryByTestId("countryIcon")).toBeFalsy()
    })
})
