import React from "react"
import { LoginScreen } from "./Login"
import { fireEvent, render } from "@testing-library/react-native"

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")

describe("Login page", () => {
    test("view component", () => {
        const onContinue = jest.fn()
        const setPin = jest.fn()

        const queries = render(<LoginScreen pin="" onContinue={onContinue} setPin={setPin} />)

        expect(queries.getByTestId("codeInput")).toBeTruthy()
        expect(queries.getByText("Continue")).toBeTruthy()

        fireEvent.press(queries.getByText("Continue"))
        expect(onContinue).toHaveBeenCalledTimes(0)

        fireEvent.changeText(queries.getByTestId("codeInput"), "2020")
        expect(setPin).toHaveBeenCalledWith("2020")

        queries.update(<LoginScreen pin="2020" onContinue={onContinue} setPin={setPin} />)

        fireEvent.press(queries.getByText("Continue"))
        expect(onContinue).toHaveBeenCalled()
    })
})
