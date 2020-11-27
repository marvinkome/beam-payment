import React from "react"
import auth from "@react-native-firebase/auth"
import { useNavigation } from "@react-navigation/native"
import { smsConfirmationObj } from "store/authStore"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { SignUp } from "./index"
import { SignUpScreen } from "./SignUp"

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")
jest.mock("store/authStore")

describe("SignUp page tests", () => {
    test("full component", async () => {
        const queries = render(<SignUp />)

        fireEvent.changeText(queries.getByPlaceholderText("Your phone number"), "07037276587")

        await waitFor(() => {
            expect(useNavigation().navigate).toBeCalledWith("VerifyPhone")
        })

        expect(auth().signInWithPhoneNumber).toHaveBeenCalledWith("+2347037276587")
        expect(smsConfirmationObj).toHaveBeenCalledWith({
            confirmation: {},
            phoneNumber: "+2347037276587",
        })
    })

    test("view component", () => {
        const onChange = jest.fn()
        const onContinue = jest.fn()

        const queries = render(
            <SignUpScreen
                phoneNumber="070372765"
                onChangePhoneNumber={onChange}
                onContinue={onContinue}
                loading={false}
            />,
        )
        expect(queries.getByText("Continue")).toBeTruthy()
        expect(onContinue).not.toBeCalled()

        // test input change
        fireEvent.changeText(queries.getByPlaceholderText("Your phone number"), "07037276587")
        expect(onChange).toBeCalled()

        // test auto submit
        queries.update(
            <SignUpScreen
                phoneNumber="07037276587"
                onChangePhoneNumber={onChange}
                onContinue={onContinue}
                loading={false}
            />,
        )
        expect(onContinue).toBeCalledWith("+2347037276587")
        onContinue.mockClear()

        queries.update(
            <SignUpScreen
                phoneNumber="7037276587"
                onChangePhoneNumber={onChange}
                onContinue={onContinue}
                loading={false}
            />,
        )
        expect(onContinue).toBeCalledWith("+2347037276587")
    })
})
