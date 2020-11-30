import React from "react"
import Share from "react-native-share"
import Clipboard from "@react-native-community/clipboard"
import dynamicLinks from "@react-native-firebase/dynamic-links"
import { MockedProvider } from "@apollo/client/testing"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { ReferralScreen } from "./Referral"
import { GET_PHONE_NUMBER, Referral } from "./index"

describe("Referral", () => {
    test("<Referral />", async () => {
        const mock = {
            request: {
                query: GET_PHONE_NUMBER,
            },
            result: {
                data: {
                    me: {
                        id: "user_id",
                        phoneNumber: "+2349087573383",
                    },
                },
            },
        }

        const screen = render(
            <MockedProvider mocks={[mock]} addTypename={false}>
                <Referral />
            </MockedProvider>,
        )

        await waitFor(() => {
            expect(dynamicLinks().buildShortLink).toHaveBeenCalled()
            expect(screen.getByText("Get ₦100 for every invite")).toBeTruthy()
        })

        fireEvent.press(screen.getByText("Copy"))
        expect(Clipboard.setString).toBeCalledWith("https://invite.usebeam.app/ashortlink")
    })

    test("<ReferralScreen />", () => {
        const screen = render(<ReferralScreen link="https://link.com" />)

        // share via whatsapp
        fireEvent.press(screen.getByText("whatsapp"))
        expect(Share.shareSingle).toBeCalledWith({
            title: "Share via",
            message:
                "I’m inviting you to sign up for Beam: Pay anyone without cash. \n" +
                "https://link.com \nGet ₦100 for every friend you invite.",
            social: "WHATSAPP",
        })

        // @ts-ignore
        Share.shareSingle.mockClear()

        // share via instgram
        fireEvent.press(screen.getByText("instagram"))
        expect(Share.shareSingle).toBeCalledWith({
            title: "Share via",
            message:
                "I’m inviting you to sign up for Beam: Pay anyone without cash. \n" +
                "https://link.com \nGet ₦100 for every friend you invite.",
            social: "INSTAGRAM",
        })

        // @ts-ignore
        Share.shareSingle.mockClear()

        // share via twitter
        fireEvent.press(screen.getByText("twitter"))
        expect(Share.shareSingle).toBeCalledWith({
            title: "Share via",
            message:
                "I’m inviting you to sign up for Beam: Pay anyone without cash. \n" +
                "https://link.com \nGet ₦100 for every friend you invite.\n #PayWithBeam @usebeamapp",
            social: "TWITTER",
        })
    })
})
