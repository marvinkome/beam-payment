import React from "react"
import { render } from "@testing-library/react-native"
import { SignUpScreen } from "./SignUp"

describe("SignUp page tests", () => {
    test("view component", () => {
        const queries = render(<SignUpScreen />)

        expect(queries.getByText("Continue")).toBeTruthy()
    })
})
