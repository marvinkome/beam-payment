import React from "react"
import { act, fireEvent, render } from "@testing-library/react-native"
import { SetPin } from "./index"
import { SetPinScreen } from "./SetPin"

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")

describe("SetPin page tests", () => {
    test("full component", async () => {
        const queries = render(<SetPin />)

        fireEvent.changeText(queries.getByTestId("codeInput"), "2020")
        fireEvent.press(queries.getByText("Continue"))

        await act(() => Promise.resolve())
    })

    test("view component", () => {
        const onContinue = jest.fn()
        const setPin = jest.fn()

        const queries = render(<SetPinScreen pin="" onContinue={onContinue} setPin={setPin} />)

        expect(queries.getByTestId("codeInput")).toBeTruthy()
        expect(queries.getByText("Continue")).toBeTruthy()

        fireEvent.press(queries.getByText("Continue"))
        expect(onContinue).toHaveBeenCalledTimes(0)

        fireEvent.changeText(queries.getByTestId("codeInput"), "2020")
        expect(setPin).toHaveBeenCalledWith("2020")

        queries.update(<SetPinScreen pin="2020" onContinue={onContinue} setPin={setPin} />)

        fireEvent.press(queries.getByText("Continue"))
        expect(onContinue).toHaveBeenCalled()
    })
})
