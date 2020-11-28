import React from "react"
import Clipboard from "@react-native-community/clipboard"
import { fireEvent, render } from "@testing-library/react-native"
import { ShareInput } from "./index"

describe("ShareInput", () => {
    test("Copy works", () => {
        const comp = render(<ShareInput link="a-link-to-copy" />)
        fireEvent.press(comp.getByText("Copy"))

        expect(Clipboard.setString).toBeCalledWith("a-link-to-copy")
    })
})
