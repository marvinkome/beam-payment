import "react-native-gesture-handler"
import React from "react"
import * as Sentry from "@sentry/react-native"
import codePush from "react-native-code-push"
import UserInactivity from "react-native-user-inactivity"
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
import { initAnalytics, trackEvent, trackPageView } from "libs/analytics"

import { LogBox } from "react-native"
LogBox.ignoreLogs(["Setting"])

if (!__DEV__) {
    Sentry.init({
        dsn: SENTRY_KEY,
    })
}

initAnalytics()

function BeamApp() {
    const appData = useAppSetup()

    if (appData.isLoading) {
        // TODO: hide splash screen
        return <Loader />
    }

    const onIdle = (active: boolean) => {
        if (!active) appData?.authContext?.signOut()
    }

    const trackStateChange = () => {
        trackPageView(navigationRef.current?.getCurrentRoute()?.name)
    }

    return (
        <ThemeProvider theme={ElementsTheme}>
            <ApolloProvider client={appData.apolloClient}>
                <AuthContext.Provider value={appData.authContext}>
                    {/* sign out after 5 mins of inactivity */}
                    <UserInactivity onAction={onIdle} timeForInactivity={5 * 60 * 1000}>
                        <NavigationContainer
                            theme={NavigationTheme}
                            ref={navigationRef}
                            onStateChange={trackStateChange}>
                            <RootNavigator />
                        </NavigationContainer>
                    </UserInactivity>
                </AuthContext.Provider>
            </ApolloProvider>
        </ThemeProvider>
    )
}

let codePushOptions = {
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    installMode: codePush.InstallMode.ON_NEXT_RESUME,
}

export default codePush(codePushOptions)(BeamApp)
