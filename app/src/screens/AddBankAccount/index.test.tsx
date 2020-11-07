import React from "react"
import { Alert } from "react-native"
import { MockedProvider } from "@apollo/client/testing"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { AddBackAccountScreen } from "./AddBankAccount"
import { AddBankAccount, ADD_BANK_ACCOUNT } from "./index"
import { useNavigation } from "@react-navigation/native"

describe("AddBankAccount", () => {
    test("<AddBankAccount />", async () => {
        // setup
        const mock = {
            request: {
                query: ADD_BANK_ACCOUNT,
                variables: {
                    data: {
                        accNumber: "0123456789",
                        bankCode: "058",
                        bankName: "GTBank Plc",
                    },
                },
            },
            result: {
                data: {
                    saveBankDetails: {
                        success: true,
                        responseMessage: null,
                        user: {
                            id: "user_id",
                            bankDetails: {
                                accountNumber: "0123456789",
                                bankName: "GTBank Plc",
                            },
                        },
                    },
                },
            },
        }

        const screen = render(
            <MockedProvider mocks={[mock]} addTypename={false}>
                <AddBankAccount />
            </MockedProvider>,
        )

        // add account number and bank name
        fireEvent.changeText(screen.getByPlaceholderText("Enter account number"), "0123456789")
        fireEvent.press(screen.getByPlaceholderText("Select bank name"))
        fireEvent.changeText(screen.getByPlaceholderText("Search bank"), "GTB")
        fireEvent.press(screen.getByText("GTBank Plc"))
        fireEvent.press(screen.getByA11yLabel("closeBtn"))

        fireEvent.press(screen.getByText("Add Account"))

        await waitFor(() => {
            expect(Alert.alert).not.toBeCalled()
            expect(useNavigation().goBack).toBeCalled()
        })
    })

    test("<AddBankAccountScreen />", () => {
        const setAccountNumber = jest.fn()
        const setBank = jest.fn()
        const onContinue = jest.fn()
        const screen = render(
            <AddBackAccountScreen
                accountNumber=""
                setAccountNumber={setAccountNumber}
                bank={null}
                setBank={setBank}
                onContinue={onContinue}
            />,
        )

        // account number
        expect(screen.getByPlaceholderText("Enter account number")).toBeTruthy()
        fireEvent.changeText(screen.getByPlaceholderText("Enter account number"), "0123456789")
        expect(setAccountNumber).toBeCalledWith("0123456789")

        // bank
        expect(screen.getByPlaceholderText("Select bank name")).toBeTruthy()
        fireEvent.press(screen.getByPlaceholderText("Select bank name"))
        fireEvent.changeText(screen.getByPlaceholderText("Search bank"), "GTB")
        fireEvent.press(screen.getByText("GTBank Plc"))
        fireEvent.press(screen.getByA11yLabel("closeBtn"))
        expect(setBank).toBeCalledWith({ Name: "GTBank Plc", Value: "058", Id: "177" })

        // continue button
        fireEvent.press(screen.getByText("Add Account"))
        expect(onContinue).not.toBeCalled()
        screen.update(
            <AddBackAccountScreen
                accountNumber="0123456789"
                setAccountNumber={setAccountNumber}
                bank={{ Name: "GTBank Plc", Value: "058", Id: "177" }}
                setBank={setBank}
                onContinue={onContinue}
            />,
        )
        fireEvent.press(screen.getByText("Add Account"))
        expect(onContinue).toBeCalled()
    })
})
