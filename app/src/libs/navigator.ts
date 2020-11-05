import { createRef } from "react"
import { NavigationContainerRef } from "@react-navigation/native"

export const navigationRef = createRef<NavigationContainerRef>()
export function navigate(name: string, params?: any) {
    navigationRef.current?.navigate(name, params)
}

export const routes = {
    main: {
        index: "Main",
        onboarding: {
            index: "OnboardingStack",
            setPin: "SetPin",
            addMoney: "AddMoney__Onboarding",
        },
        transferTab: {
            index: "TransferTab",
            transfer: "Transfer",
            transactionHistory: "TransactionHistory",
        },
        cashSettings: "CashSettings",
    },
    public: {
        index: "Public",
        login: "Login",
        signUp: "SignUp",
        verifyPhone: "VerifyPhone",
    },
} as const
