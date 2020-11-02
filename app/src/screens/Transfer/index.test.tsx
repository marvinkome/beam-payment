import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { TransferScreen } from "./Transfer"

describe("Transfer", () => {
    test("<TranserScreen />", () => {
        const onChangeAmount = jest.fn()
        const onChangeReceiverNumber = jest.fn()
        const onContinue = jest.fn()

        const queries = render(
            <TransferScreen
                loading={false}
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

        queries.update(
            <TransferScreen
                loading={false}
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
})
