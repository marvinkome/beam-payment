import React from "react"
import { View, Text } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"

const EmptyScreen = () => (
    <View>
        <Text>Empty screen</Text>
    </View>
)

const PublicStack = createStackNavigator()
function PublicStackNavigator() {
    return (
        <PublicStack.Navigator headerMode="none">
            <PublicStack.Screen name="SignUpPage" component={EmptyScreen} />
        </PublicStack.Navigator>
    )
}

const RootStack = createStackNavigator()
export function RootNavigator() {
    const isLoggedIn = false

    return (
        <RootStack.Navigator headerMode="none">
            {isLoggedIn ? (
                <RootStack.Screen name="Main" component={EmptyScreen} />
            ) : (
                <RootStack.Screen name="PublicPage" component={PublicStackNavigator} />
            )}
        </RootStack.Navigator>
    )
}
