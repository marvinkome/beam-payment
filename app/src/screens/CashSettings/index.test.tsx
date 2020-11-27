import React from "react"
import { MockedProvider } from "@apollo/client/testing"
import { fireEvent, render, waitFor, act } from "@testing-library/react-native"
import { CashSettingsScreen } from "./CashSettings"
import { CashSettings, GET_CASH_DETAILS, WITHDRAW_MONEY } from "./index"
import { Alert } from "react-native"

describe("CashSettings", () => {
    beforeEach(() => {
        // @ts-ignore
        Alert.alert.mockClear()
    })

    test("<CashSettings /> - without bankDetails", async () => {
        const queryMock = {
            request: {
                query: GET_CASH_DETAILS,
            },
            result: {
                data: {
                    me: {
                        id: "user_id",
                        accountBalance: 5000,
                        bankDetails: null,
                    },
                },
            },
        }

        const screen = render(
            <MockedProvider mocks={[queryMock]} addTypename={false}>
                <CashSettings />
            </MockedProvider>,
        )

        fireEvent.press(screen.getByText("Withdraw"))

        // @ts-ignore
        expect(Alert.alert.mock.calls[0][1]).toBe(
            "Please set bank details to be able to withdraw funds",
        )
    })

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

        await waitFor(() => {
            expect(screen.getByText("GTBank Plc")).toBeTruthy()
            expect(screen.getByText("0123456789")).toBeTruthy()
        })

        fireEvent.press(screen.getByText("Withdraw"))

        // @ts-ignore
        expect(Alert.alert.mock.calls[0][1]).toBe(
            "Send NGN5,000 to 0123456789 - GTBank Plc? NGN11 withdrawal fee.",
        )

        await act(async () => {
            // @ts-ignore
            await Alert.alert.mock.calls[0][2][1].onPress()
            expect(Alert.alert).toBeCalledWith(
                "Success!",
                "Money has been sent to your bank account",
            )
        })

        expect(screen.getByText("GTBank Plc")).toBeTruthy()
    })

    test("<CashSettingsScreen />", () => {
        const onWithdraw = jest.fn()
        const screen = render(
            <CashSettingsScreen
                bankDetails={{ bankName: "GTBank Plc", accountNumber: "0123456789" }}
                onWithdraw={onWithdraw}
            />,
        )

        expect(screen.getByText("GTBank Plc")).toBeTruthy()
        expect(screen.getByText("0123456789")).toBeTruthy()

        fireEvent.press(screen.getByText("Withdraw"))
        expect(onWithdraw).toHaveBeenCalled()
    })
})
