import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { AddBackAccountScreen } from "./AddBankAccount"

describe("AddBankAccount", () => {
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

        // account name
        expect(screen.queryByText("Test User")).toBeFalsy()
        screen.update(
            <AddBackAccountScreen
                accountNumber=""
                setAccountNumber={setAccountNumber}
                bank={null}
                setBank={setBank}
                loadingAccountDetails={false}
                accountName="Test User"
                onContinue={onContinue}
            />,
        )
        expect(screen.queryByText("Test User")).toBeTruthy()

        // continue button
        fireEvent.press(screen.getByText("Add Account"))
        expect(onContinue).not.toBeCalled()
        screen.update(
            <AddBackAccountScreen
                accountNumber="0123456789"
                setAccountNumber={setAccountNumber}
                bank={{ Name: "GTBank Plc", Value: "058", Id: "177" }}
                setBank={setBank}
                loadingAccountDetails={false}
                accountName="Test User"
                onContinue={onContinue}
            />,
        )
        fireEvent.press(screen.getByText("Add Account"))
        expect(onContinue).toBeCalled()
    })
})
