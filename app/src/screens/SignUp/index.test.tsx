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
        fireEvent.press(queries.getByText("Continue"))

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
                phoneNumber="0703727658"
                onChangePhoneNumber={onChange}
                onContinue={onContinue}
                loading={false}
            />,
        )
        expect(queries.getByText("Continue")).toBeTruthy()

        // test input change
        fireEvent.changeText(queries.getByPlaceholderText("Your phone number"), "07037276587")
        expect(onChange).toHaveBeenCalled()

        // text submit
        fireEvent.press(queries.getByText("Continue"))
        expect(onContinue).toHaveBeenCalled()
    })
})
