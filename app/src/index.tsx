import "react-native-gesture-handler"
import React from "react"
import * as Sentry from "@sentry/react-native"
import { ApolloProvider } from "@apollo/client"
import { NavigationContainer } from "@react-navigation/native"
import { ThemeProvider } from "react-native-elements"
import { RootNavigator } from "navigators"
import { Loader } from "components/Loader"
import { ElementsTheme, NavigationTheme } from "styles/theme"
import { AuthContext } from "libs/auth-context"
import { navigationRef } from "libs/navigator"
import { useAppSetup } from "hooks/app-setup"
import { SENTRY_KEY } from "libs/keys"
import { initAnalytics, trackEvent } from "libs/analytics"

if (!__DEV__) {
    Sentry.init({
        dsn: SENTRY_KEY,
    })
}

initAnalytics()

export default function BeamApp() {
    const appData = useAppSetup()

    if (appData.isLoading) {
        // TODO: hide splash screen
        return <Loader />
    }

    const trackStateChange = () => {
        trackEvent("Visit page", { pageName: navigationRef.current?.getCurrentRoute()?.name })
    }

    return (
        <ThemeProvider theme={ElementsTheme}>
            <ApolloProvider client={appData.apolloClient}>
                <AuthContext.Provider value={appData.authContext}>
                    <NavigationContainer
                        theme={NavigationTheme}
                        ref={navigationRef}
                        onStateChange={trackStateChange}>
                        <RootNavigator />
                    </NavigationContainer>
                </AuthContext.Provider>
            </ApolloProvider>
        </ThemeProvider>
    )
}
