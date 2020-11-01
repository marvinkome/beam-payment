import React from "react"

export type AuthContextType = null | {
    signIn: () => void
    signOut: () => void
    isLoggedIn: boolean
    hasPublicDetails: boolean
}
export const AuthContext = React.createContext<AuthContextType>(null)
