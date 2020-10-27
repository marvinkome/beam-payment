import React from "react"
import { ToastAndroid } from "react-native"
import { fireEvent, render, act } from "@testing-library/react-native"
import { smsConfirmationObj } from "store/authStore"
import { VerifyPhone } from "./index"
import { VerifyPhoneScreen } from "./VerifyPhone"

ToastAndroid.show = jest.fn()
ToastAndroid.SHORT = 0
let confirm: any = jest
    .fn()
    .mockImplementationOnce(() => Promise.reject())
    .mockImplementationOnce(() => Promise.resolve())

// mocks
// @ts-ignore
smsConfirmationObj.mockImplementation(() => ({
    phoneNumber: "+234913498619",
    confirmation: {
        confirm,
    },
}))
jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")
jest.mock("store/authStore")

describe("Verify phone page tests", () => {
    test("full component", async () => {
        const queries = render(<VerifyPhone />)
        expect(smsConfirmationObj).toHaveBeenCalled()

        fireEvent.changeText(queries.getByTestId("codeInput"), "202020")

        // expect error to happen
        fireEvent.press(queries.getByText("Continue"))

        await act(() => Promise.resolve())

        expect(confirm).toHaveBeenCalledWith("202020")
        expect(ToastAndroid.show).toHaveBeenCalledWith("Invalid code", 0)
    })

    test("view component", () => {
        const onVerify = jest.fn()
        const setCode = jest.fn()

        const queries = render(
            <VerifyPhoneScreen
                code=""
                setCode={setCode}
                phoneNumber="+234913498619"
                onVerify={onVerify}
                loading={false}
            />,
        )

        expect(queries.getByText("Sent code to \n+234913498619")).toBeTruthy()
        expect(queries.getByTestId("codeInput")).toBeTruthy()
        expect(queries.getByText(/Send again/)).toBeTruthy()
        expect(queries.getByText("Continue")).toBeTruthy()

        fireEvent.changeText(queries.getByTestId("codeInput"), "202020")
        expect(setCode).toHaveBeenCalledWith("202020")

        queries.update(
            <VerifyPhoneScreen
                code="202020"
                setCode={setCode}
                phoneNumber="+234913498619"
                onVerify={onVerify}
                loading={false}
            />,
        )

        fireEvent.press(queries.getByText("Continue"))
        expect(onVerify).toHaveBeenCalled()
    })
})
