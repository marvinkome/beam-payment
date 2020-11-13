import React from "react"

export type OnboardingContextType = null | {
    completeOnboarding: () => void
    hasCompletedOnboarding: boolean
}
export const OnboardingContext = React.createContext<OnboardingContextType>(null)
