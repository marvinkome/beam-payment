import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { PinInput } from "./index"

describe("PhoneNumberInput", () => {
    it("should container input, icon and text children", () => {
        const onChangeText = jest.fn()

        const queries = render(
            <PinInput codeLength={5} testID="codeInput" value="" onChange={onChangeText} />,
        )
        expect(queries.getByTestId("codeInput")).toBeTruthy()

        fireEvent.changeText(queries.getByTestId("codeInput"), "20202")
        expect(onChangeText).toHaveBeenCalledWith("20202")
    })
})
