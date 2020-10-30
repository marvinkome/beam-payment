import "react-native-gesture-handler"
import React from "react"
import { ApolloProvider } from "@apollo/client"
import { NavigationContainer } from "@react-navigation/native"
import { ThemeProvider } from "react-native-elements"
import { RootNavigator } from "navigators"
import { Loader } from "components/Loader"
import { ElementsTheme, NavigationTheme } from "styles/theme"
import { AuthContext } from "libs/auth-context"
import { navigationRef } from "libs/navigator"
import { useAppSetup } from "hooks/app-setup"

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
