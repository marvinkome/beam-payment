import React from "react"
import { Linking } from "react-native"
import { render, fireEvent } from "@testing-library/react-native"
import { TextLink } from "./index"

Linking.openURL = jest.fn()

describe("TextLink", () => {
    test("with link", () => {
        const query = render(<TextLink href="http://example.com">I'm a link</TextLink>)

        fireEvent.press(query.getByText("I'm a link"))
        expect(Linking.openURL).toHaveBeenCalledWith("http://example.com")
    })

    test("with onPress", () => {
        const onPress = jest.fn()
        const query = render(<TextLink onPress={onPress}>I'm a link</TextLink>)

        fireEvent.press(query.getByText("I'm a link"))
        expect(onPress).toHaveBeenCalledWith()
    })
})
