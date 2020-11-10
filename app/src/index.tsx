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

if (!__DEV__) {
    Sentry.init({
        dsn: SENTRY_KEY,
    })
}

export default function BeamApp() {
    const appData = useAppSetup()

    if (appData.isLoading) {
        // TODO: hide splash screen
        return <Loader />
    }

    return (
        <ThemeProvider theme={ElementsTheme}>
            <ApolloProvider client={appData.apolloClient}>
                <AuthContext.Provider value={appData.authContext}>
                    <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
                        <RootNavigator />
                    </NavigationContainer>
                </AuthContext.Provider>
            </ApolloProvider>
        </ThemeProvider>
    )
}
