import React from "react"
import Share from "react-native-share"
import { fireEvent, render } from "@testing-library/react-native"
import { SocialShare } from "./index"

describe("SocialShare", () => {
    test("test whatsapp share", () => {
        const comp = render(<SocialShare platform="whatsapp" shareText="A text to share" />)
        fireEvent.press(comp.getByText("whatsapp"))

        expect(Share.shareSingle).toBeCalledWith({
            title: "Share via",
            message: "A text to share",
            social: "WHATSAPP",
        })
    })

    test("test instagram share", () => {
        const comp = render(<SocialShare platform="instagram" shareText="A text to share" />)
        fireEvent.press(comp.getByText("instagram"))

        expect(Share.shareSingle).toBeCalledWith({
            title: "Share via",
            message: "A text to share",
            social: "INSTAGRAM",
        })
    })

    test("test twitter share", () => {
        const comp = render(<SocialShare platform="twitter" shareText="A text to share" />)
        fireEvent.press(comp.getByText("twitter"))

        expect(Share.shareSingle).toBeCalledWith({
            title: "Share via",
            message: "A text to share",
            social: "TWITTER",
        })
    })
})
