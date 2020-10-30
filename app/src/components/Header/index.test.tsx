import React from "react"
import { render } from "@testing-library/react-native"
import { Header } from "./index"

test("Header", () => {
    const query = render(<Header />)

    expect(query.getByText("0")).toBeTruthy()
})
