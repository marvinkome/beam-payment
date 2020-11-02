import { gql, useQuery } from "@apollo/client"

export function useMainSetup() {
    const { data, loading } = useQuery(gql`
        query isNewAccount {
            me {
                id
                isNewAccount
            }
        }
    `)
    return { loading, isNewAccount: data?.me?.isNewAccount }
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
