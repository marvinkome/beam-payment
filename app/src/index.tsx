import "react-native-gesture-handler"
import React from "react"
import { ThemeProvider } from "react-native-elements"
import { NavigationContainer } from "@react-navigation/native"
import { RootNavigator } from "navigators"
import { ElementsTheme, NavigationTheme } from "styles/theme"
import { navigationRef } from "libs/navigator"

export default function BeamApp() {
    return (
        <ThemeProvider theme={ElementsTheme}>
            <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
                <RootNavigator />
            </NavigationContainer>
        </ThemeProvider>
    )
}
