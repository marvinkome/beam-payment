import { useEffect, useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { OnboardingContextType } from "libs/onboarding-context"

export function useMainSetup() {
    const [isLoading, setLoading] = useState(true)
    const [onboardingCompleted, setOnboardingCompleted] = useState(false)

    const { data } = useQuery(gql`
        query isNewAccount {
            me {
                id
                isNewAccount
            }
        }
    `)

    useEffect(() => {
        if (data?.me) {
            setOnboardingCompleted(!data?.me?.isNewAccount)
            setLoading(false)
        }
    }, [data])

    const onboardingContext: OnboardingContextType = {
        completeOnboarding: () => setOnboardingCompleted(true),
        hasCompletedOnboarding: onboardingCompleted,
    }

    return { loading: isLoading, onboardingContext }
}

export function useOnboardingStep() {
    const { data, loading } = useQuery(gql`
        query AccountSetupState {
            me {
                id
                accountSetupState
            }
        }
    `)
    return { loading, onboardingStep: data?.me?.accountSetupState }
}
