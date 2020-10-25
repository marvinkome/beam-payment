import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { PhoneNumberInput } from "./index"

describe("PhoneNumberInput", () => {
    it("should container input, icon and text children", () => {
        let withIcon = true
        const onChange = jest.fn()

        // test render
        const queries = render(
            <PhoneNumberInput value="" onChange={onChange} withIcon={withIcon} />,
        )
        expect(queries.getByTestId("countryIcon")).toBeTruthy()
        expect(queries.getByText("+234")).toBeTruthy()
        expect(queries.getByPlaceholderText("Enter phone number")).toBeTruthy()

        // test icon change
        withIcon = false
        queries.update(<PhoneNumberInput value="" onChange={onChange} withIcon={withIcon} />)
        expect(queries.queryByTestId("countryIcon")).toBeFalsy()

        // test value change
        fireEvent.changeText(queries.getByPlaceholderText("Enter phone number"), "070")
        expect(onChange).toHaveBeenCalled()
    })
})
