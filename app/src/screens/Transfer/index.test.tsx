import React from "react"
import { MockedProvider } from "@apollo/client/testing"
import { Alert } from "react-native"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { TransferScreen } from "./Transfer"
import { Transfer, TRANSER_MONEY } from "./index"
import { useRoute } from "@react-navigation/native"
import { routes } from "libs/navigator"

describe("Transfer", () => {
    test("<TranserScreen />", () => {
        const onChangeAmount = jest.fn()
        const onChangeReceiverNumber = jest.fn()
        const onContinue = jest.fn()

        const queries = render(
            <TransferScreen
                loading={false}
                disableBtn={true}
                amount=""
                receiverNumber=""
                onChangeAmount={onChangeAmount}
                onChangeReceiverNumber={onChangeReceiverNumber}
                onContinue={onContinue}
            />,
        )

        // test input change
        fireEvent.changeText(queries.getByPlaceholderText("Enter amount"), "500")
        expect(onChangeAmount).toHaveBeenCalled()

        // test input change
        fireEvent.changeText(queries.getByPlaceholderText("Enter phone number"), "07037276587")
        expect(onChangeReceiverNumber).toHaveBeenCalled()

        fireEvent.press(queries.getByText("Send money"))
        expect(onContinue).not.toHaveBeenCalled()

        queries.update(
            <TransferScreen
                loading={false}
                disableBtn={false}
                amount="500"
                receiverNumber="07037276587"
                onChangeAmount={onChangeAmount}
                onChangeReceiverNumber={onChangeReceiverNumber}
                onContinue={onContinue}
            />,
        )

        // test submit
        fireEvent.press(queries.getByText("Send money"))
        expect(onContinue).toHaveBeenCalled()
    })

    test("<Transfer />", async () => {
        const mock = {
            request: {
                query: TRANSER_MONEY,
                variables: {
                    amount: 500,
                    receiverNumber: "+2349087573383",
                },
            },
            result: {
                data: {
                    transferMoney: {
                        success: true,
                        responseMessage: null,
                        user: {
                            id: "user_id",
                            accountBalance: 400,
                        },
                    },
                },
            },
        }

        const queries = render(
            <MockedProvider mocks={[mock]} addTypename={false}>
                <Transfer />
            </MockedProvider>,
        )

        fireEvent.changeText(queries.getByPlaceholderText("Enter amount"), "500")
        expect(queries.queryByDisplayValue("500")).toBeTruthy()

        fireEvent.changeText(queries.getByPlaceholderText("Enter phone number"), "09087573383")
        expect(queries.queryByDisplayValue("09087573383")).toBeTruthy()

        await waitFor(() => {
            expect(Alert.alert).toBeCalledWith("Success", "Money has been sent to +2349087573383")
        })

        expect(queries.queryByDisplayValue("500")).toBeFalsy()
        expect(queries.queryByDisplayValue("09087573383")).toBeFalsy()
    })

    test("<Transfer /> - with initial value", () => {
        // @ts-ignore
        useRoute.mockImplementation(() => ({
            params: { phoneNumber: "07089073483" },
        }))

        const mock = {
            request: {
                query: TRANSER_MONEY,
                variables: {
                    amount: 500,
                    receiverNumber: "+2347089073483",
                },
            },
            result: {
                data: {
                    transferMoney: {
                        success: true,
                        responseMessage: null,
                        user: {
                            id: "user_id",
                            accountBalance: 400,
                        },
                    },
                },
            },
        }

        const queries = render(
            <MockedProvider mocks={[mock]} addTypename={false}>
                <Transfer />
            </MockedProvider>,
        )

        expect(queries.queryByDisplayValue("07089073483")).toBeTruthy()
    })

    test("<Transfer /> - floats", async () => {
        const mock = {
            request: {
                query: TRANSER_MONEY,
                variables: {
                    amount: 1.5,
                    receiverNumber: "+2349087573383",
                },
            },
            result: {
                data: {
                    transferMoney: {
                        success: true,
                        responseMessage: null,
                        user: {
                            id: "user_id",
                            accountBalance: 400,
                        },
                    },
                },
            },
        }

        const queries = render(
            <MockedProvider mocks={[mock]} addTypename={false}>
                <Transfer />
            </MockedProvider>,
        )

        fireEvent.changeText(queries.getByPlaceholderText("Enter amount"), "0.5")
        expect(queries.queryByDisplayValue("0.5")).toBeTruthy()

        fireEvent.changeText(queries.getByPlaceholderText("Enter phone number"), "09087573383")
        expect(queries.queryByDisplayValue("09087573383")).toBeTruthy()

        expect(Alert.alert).toBeCalledWith("Error", "The amount is too small")

        fireEvent.changeText(queries.getByPlaceholderText("Enter amount"), "1.5")

        await waitFor(() => {
            expect(Alert.alert).toBeCalledWith("Success", "Money has been sent to +2349087573383")
        })

        expect(queries.queryByDisplayValue("1.5")).toBeFalsy()
        expect(queries.queryByDisplayValue("09087573383")).toBeFalsy()
    })
})
