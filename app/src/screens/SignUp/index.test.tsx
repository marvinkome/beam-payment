import React from "react"
import { render } from "@testing-library/react-native"
import { SignUp } from "./index"

describe("SignUp page tests", () => {
    test("Renders main screen", () => {
        const renderedComp = render(<SignUp />)
        expect(renderedComp.toJSON()).toMatchSnapshot()
    })
})
