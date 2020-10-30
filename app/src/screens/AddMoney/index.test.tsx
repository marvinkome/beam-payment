import React from "react"
import { render, within, fireEvent } from "@testing-library/react-native"

// components
import { Amount } from "./Amount"
import { AddMoneyScreen } from "./AddMoney"
import { AddMoney } from "./index"

describe("AddMoney", () => {
    test("<Amount />", () => {
        const onSelectAmount = jest.fn()

        const query = render(<Amount selectedAmount="3000" onSelectAmount={onSelectAmount} />)

        expect(query.getByText("NGN 500")).toBeTruthy()
        expect(query.getByText("NGN 1,500")).toBeTruthy()
        expect(query.getByText("NGN 3,000")).toBeTruthy()

        const selectedCheckbox = within(query.getByA11yState({ checked: true }))
        expect(selectedCheckbox.getByText("NGN 3,000")).toBeTruthy()

        fireEvent.press(query.getByText("NGN 500"))
        expect(onSelectAmount).toHaveBeenCalledWith("500")

        query.update(<Amount selectedAmount="500" onSelectAmount={onSelectAmount} />)

        const nextSelectedCheckbox = within(query.getByA11yState({ checked: true }))
        expect(nextSelectedCheckbox.getByText("NGN 500")).toBeTruthy()
    })

    test("<AddMoneyScreen />", () => {
        const onSelectAmount = jest.fn()
        const onContinue = jest.fn()

        const query = render(
            <AddMoneyScreen
                loading={false}
                selectedAmount="500"
                onSelectAmount={onSelectAmount}
                onContinue={onContinue}
            />,
        )

        const selectedCheckbox = within(query.getByA11yState({ checked: true }))
        expect(selectedCheckbox.getByText("NGN 500")).toBeTruthy()

        fireEvent.press(query.getByText("NGN 1,500"))
        expect(onSelectAmount).toHaveBeenCalledWith("1500")

        fireEvent.press(query.getByText("Continue"))
        expect(onContinue).toHaveBeenCalled()
    })

    test("<AddMoney />", () => {
        const query = render(<AddMoney />)

        const selectedCheckbox = within(query.getByA11yState({ checked: true }))
        expect(selectedCheckbox.getByText("NGN 500")).toBeTruthy()
    })
})
