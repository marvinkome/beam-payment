import React, { useContext } from "react"
import { View, Text } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { AuthContext } from "libs/auth-context"
import { fonts } from "styles/fonts"

// screens
import { SignUp } from "screens/authentication/SignUp"
import { VerifyPhone } from "screens/authentication/VerifyPhone"
import { SetPin } from "screens/authentication/SetPin"

const EmptyScreen = () => (
    <View>
        <Text>Empty screen</Text>
    </View>
)

const PublicStack = createStackNavigator()
function PublicStackNavigator() {
    const options = {
        headerStyle: {
            elevation: 0,
            height: 70,
        },
        headerTitleStyle: {
            letterSpacing: 0.8,
            fontSize: 22,
            ...fonts.semiBold,
        },
    }

    return (
        <PublicStack.Navigator screenOptions={options}>
            <PublicStack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <PublicStack.Screen
                name="VerifyPhone"
                component={VerifyPhone}
                options={{ title: "Verify number" }}
            />
            <PublicStack.Screen
                name="SetPin"
                component={SetPin}
                options={{ title: "Set your pin" }}
            />
        </PublicStack.Navigator>
    )
}

const RootStack = createStackNavigator()
export function RootNavigator() {
    const authContext = useContext(AuthContext)

    return (
        <RootStack.Navigator headerMode="none">
            {authContext?.isLoggedIn ? (
                <RootStack.Screen name="Main" component={EmptyScreen} />
            ) : (
                <RootStack.Screen name="PublicPage" component={PublicStackNavigator} />
            )}
        </RootStack.Navigator>
    )
}
