import React from "react"
import { useRoute, useNavigation } from "@react-navigation/native"
import { View } from "react-native"
import { PayWithFlutterwave } from "flutterwave-react-native"
import { render, within, fireEvent, waitFor } from "@testing-library/react-native"
import { MockedProvider } from "@apollo/client/testing"

// components
import { Amount } from "./Amount"
import { AddMoneyScreen } from "./AddMoney"
import { AddMoney, ADD_MONEY } from "./index"
import { routes } from "libs/navigator"
import { OnboardingContext } from "libs/onboarding-context"

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
        PayWithFlutterwave.mockImplementationOnce(({ customButton }: any) => {
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

    test("<AddMoney /> - onboarding screen", async () => {
        // @ts-ignore
        useRoute.mockImplementation(() => ({
            name: "AddMoney__Onboarding",
        }))

        const mock = {
            request: {
                query: ADD_MONEY,
                variables: {
                    addMoneyInput: {
                        tx_ref: "a-short-id",
                        tx_id: "a-transaction-id",
                        amount: 500,
                    },
                },
            },
            result: {
                data: {
                    addMoney: {
                        success: true,
                        responseMessage: null,
                        user: {
                            id: "user_id",
                            accountBalance: 500,
                        },
                    },
                },
            },
        }

        const onboardingCtx = {
            hasCompletedOnboarding: false,
            completeOnboarding: jest.fn(),
        }

        const query = render(
            <MockedProvider mocks={[mock]} addTypename={false}>
                <OnboardingContext.Provider value={onboardingCtx}>
                    <AddMoney />
                </OnboardingContext.Provider>
            </MockedProvider>,
        )

        const selectedCheckbox = within(query.getByA11yState({ checked: true }))
        expect(selectedCheckbox.getByText("NGN 500")).toBeTruthy()

        const props = query.UNSAFE_getByType(PayWithFlutterwave).props

        expect(props.options).toHaveProperty("tx_ref", "a-short-id")
        expect(props.options).toHaveProperty("amount", 510)
        expect(props.options).toHaveProperty("currency", "NGN")

        fireEvent.press(query.getByText("Continue"))

        await waitFor(() => {
            expect(onboardingCtx.completeOnboarding).toBeCalled()
        })
    })

    test("<AddMoney /> - main screen", async () => {
        // @ts-ignore
        useRoute.mockImplementation(() => ({
            name: routes.main.addMoney,
        }))

        const mock = {
            request: {
                query: ADD_MONEY,
                variables: {
                    addMoneyInput: {
                        tx_ref: "a-short-id",
                        tx_id: "a-transaction-id",
                        amount: 500,
                    },
                },
            },
            result: {
                data: {
                    addMoney: {
                        success: true,
                        responseMessage: null,
                        user: {
                            id: "user_id",
                            accountBalance: 500,
                        },
                    },
                },
            },
        }

        const query = render(
            <MockedProvider mocks={[mock]} addTypename={false}>
                <AddMoney />
            </MockedProvider>,
        )

        const selectedCheckbox = within(query.getByA11yState({ checked: true }))
        expect(selectedCheckbox.getByText("NGN 500")).toBeTruthy()

        const props = query.UNSAFE_getByType(PayWithFlutterwave).props

        expect(props.options).toHaveProperty("tx_ref", "a-short-id")
        expect(props.options).toHaveProperty("amount", 510)
        expect(props.options).toHaveProperty("currency", "NGN")

        fireEvent.press(query.getByText("Continue"))

        await waitFor(() => {
            expect(useNavigation().goBack).toBeCalled()
        })
    })
})
