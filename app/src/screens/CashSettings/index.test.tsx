import React from "react"
import { MockedProvider } from "@apollo/client/testing"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { CashSettingsScreen } from "./CashSettings"
import { CashSettings, GET_CASH_DETAILS } from "./index"

describe("CashSettings", () => {
    test("<CashSettings />", async () => {
        const queryMock = {
            request: {
                query: GET_CASH_DETAILS,
            },
            result: {
                data: {
                    me: {
                        id: "user_id",
                        accountBalance: 5000,
                        bankDetails: {
                            accountNumber: "0123456789",
                            bankName: "GTBank Plc",
                        },
                    },
                },
            },
        }

        const screen = render(
            <MockedProvider mocks={[queryMock]} addTypename={false}>
                <CashSettings />
            </MockedProvider>,
        )

        expect(screen.getByText("NGN 0")).toBeTruthy()

        await waitFor(() => {
            expect(screen.getByText("NGN 5,000")).toBeTruthy()
            expect(screen.getByText("GTBank Plc")).toBeTruthy()
            expect(screen.getByText("0123456789")).toBeTruthy()
        })
    })

    test("<CashSettingsScreen />", () => {
        const onWithdraw = jest.fn()
        const screen = render(
            <CashSettingsScreen
                accountBalance={2000}
                bankDetails={{ bankName: "GTBank Plc", accountNumber: "0123456789" }}
                onWithdraw={onWithdraw}
            />,
        )

        expect(screen.getByText("NGN 2,000")).toBeTruthy()
        expect(screen.getByText("GTBank Plc")).toBeTruthy()
        expect(screen.getByText("0123456789")).toBeTruthy()

        fireEvent.press(screen.getByText("Withdraw"))
        expect(onWithdraw).toHaveBeenCalled()
    })
})
