import React from "react"
import { View } from "react-native"
import { PayWithFlutterwave } from "flutterwave-react-native"
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

        // @ts-ignore
        PayWithFlutterwave.mockImplementation(({ customButton }: any) => {
            return <View>{customButton({ disabled: false, onPress: onContinue })}</View>
        })

        const renderContinueBtn = (renderButton: (props: any) => any) => (
            // @ts-ignore
            <PayWithFlutterwave customButton={renderButton} />
        )

        const query = render(
            <AddMoneyScreen
                loading={false}
                selectedAmount="500"
                onSelectAmount={onSelectAmount}
                renderContinueBtn={renderContinueBtn}
            />,
        )

        const selectedCheckbox = within(query.getByA11yState({ checked: true }))
        expect(selectedCheckbox.getByText("NGN 500")).toBeTruthy()

        fireEvent.press(query.getByText("NGN 1,500"))
        expect(onSelectAmount).toHaveBeenCalledWith("1500")

        expect(query.getByText("Continue")).toBeTruthy()

        fireEvent.press(query.getByText("Continue"))
        expect(onContinue).toHaveBeenCalled()
    })

    test("<AddMoney />", () => {
        const query = render(<AddMoney />)

        const selectedCheckbox = within(query.getByA11yState({ checked: true }))
        expect(selectedCheckbox.getByText("NGN 500")).toBeTruthy()

        const props = query.UNSAFE_getByType(PayWithFlutterwave).props

        expect(props.options).toHaveProperty("tx_ref", "a-short-id")
        expect(props.options).toHaveProperty("amount", 500)
        expect(props.options).toHaveProperty("currency", "NGN")
    })
})
