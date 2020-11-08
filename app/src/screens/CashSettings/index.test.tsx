import React from "react"
import { MockedProvider } from "@apollo/client/testing"
import { fireEvent, render, waitFor, act } from "@testing-library/react-native"
import { CashSettingsScreen } from "./CashSettings"
import { CashSettings, GET_CASH_DETAILS, WITHDRAW_MONEY } from "./index"
import { Alert } from "react-native"

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

        const mutMock = {
            request: {
                query: WITHDRAW_MONEY,
            },
            result: {
                data: {
                    withdrawMoney: {
                        success: true,
                        responseMessage: null,
                        user: {
                            id: "user1",
                            accountBalance: 0,
                        },
                    },
                },
            },
        }

        const screen = render(
            <MockedProvider mocks={[queryMock, mutMock]} addTypename={false}>
                <CashSettings />
            </MockedProvider>,
        )

        expect(screen.getByText("NGN 0")).toBeTruthy()

        await waitFor(() => {
            expect(screen.getByText("NGN 5,000")).toBeTruthy()
            expect(screen.getByText("GTBank Plc")).toBeTruthy()
            expect(screen.getByText("0123456789")).toBeTruthy()
        })

        fireEvent.press(screen.getByText("Withdraw"))

        // @ts-ignore
        expect(Alert.alert.mock.calls[0][0]).toBe("Confirm!")

        // @ts-ignore
        expect(Alert.alert.mock.calls[0][1]).toBe("Send NGN 4,975 to 0123456789 - GTBank Plc?")

        await act(async () => {
            // @ts-ignore
            await Alert.alert.mock.calls[0][2][1].onPress()
            expect(Alert.alert).toBeCalledWith(
                "Success!",
                "Money has been sent to your bank account",
            )
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
