import React, { useContext, useState } from "react"
import shortid from "shortid"
import * as Sentry from "@sentry/react-native"
import { gql, useMutation } from "@apollo/client"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Alert } from "react-native"
import { PayWithFlutterwave } from "flutterwave-react-native"
import { CustomButtonProps } from "flutterwave-react-native/dist/PaywithFlutterwaveBase"
import { RedirectParams } from "flutterwave-react-native/dist/PayWithFlutterwave"
import { FLUTTERWAVE_KEY, EMAIL_URL } from "libs/keys"
import { DEPOSIT_FEE } from "libs/constants"
import { AddMoneyScreen } from "./AddMoney"
import { routes } from "libs/navigator"
import { trackEvent } from "libs/analytics"
import { OnboardingContext } from "libs/onboarding-context"

export const ADD_MONEY = gql`
    mutation AddMoney($addMoneyInput: AddMoneyInput) {
        addMoney(data: $addMoneyInput) {
            success
            responseMessage
            user {
                id
                accountBalance
            }
        }
    }
`

export function useAddMoneyToUserAccount() {
    const [addingMoney, setAddingMoney] = useState(false)
    const [addMoney] = useMutation(ADD_MONEY)
    const onboardingContext = useContext(OnboardingContext)
    const navigation = useNavigation()
    const route = useRoute()

    return {
        addingMoney,
        addMoney: async (params: RedirectParams, amount: string) => {
            if (params.status !== "successful") {
                Sentry.captureMessage("Transaction failed. Please try again")
                return Alert.alert("Error!", "Transaction failed. Please try again")
            }

            setAddingMoney(true)

            try {
                const addMoneyResp = await addMoney({
                    variables: {
                        addMoneyInput: {
                            tx_id: params.transaction_id,
                            tx_ref: params.tx_ref,
                            amount: parseInt(amount, 10),
                        },
                    },
                })

                const { success, responseMessage } = addMoneyResp?.data?.addMoney

                if (!success) {
                    Sentry.captureMessage(responseMessage)
                    setAddingMoney(false)
                    return Alert.alert("Error!", responseMessage)
                }

                setAddingMoney(false)
                trackEvent("Added money to account")

                // handle redirect
                // if it's onboarding
                if (route.name === routes.main.addMoney) {
                    return navigation.goBack()
                }

                onboardingContext?.completeOnboarding()
            } catch (err) {
                Sentry.captureException(err)
                setAddingMoney(false)
                return Alert.alert("Error!", "Failed to credit account")
            }
        },
    }
}

export type Amounts = "500" | "1500" | "3000"
export function AddMoney() {
    const [amount, setAmount] = useState<Amounts>("500")
    const { addingMoney, addMoney } = useAddMoneyToUserAccount()
    const onboardingContext = useContext(OnboardingContext)
    const route = useRoute()

    const payWithFlutterWaveBtn = (renderButton: (props: CustomButtonProps) => React.ReactNode) => (
        <PayWithFlutterwave
            onRedirect={(params: RedirectParams) => addMoney(params, amount)}
            onInitializeError={(e) => Sentry.captureException(e)}
            customButton={renderButton}
            options={{
                tx_ref: shortid.generate(),
                currency: "NGN",
                authorization: FLUTTERWAVE_KEY,
                customer: { email: EMAIL_URL },
                amount: parseInt(amount, 10) + parseInt(amount, 10) * DEPOSIT_FEE,
            }}
        />
    )

    return (
        <AddMoneyScreen
            loading={addingMoney}
            selectedAmount={amount}
            isOnboarding={route.name !== routes.main.addMoney}
            onSelectAmount={setAmount}
            renderContinueBtn={payWithFlutterWaveBtn}
            skipOnboarding={onboardingContext?.completeOnboarding}
        />
    )
}
