import React, { useContext } from "react"
import { View, Text } from "react-native"
import { Header } from "components/Header"
import { Loader } from "components/Loader"
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack"
import { AuthContext } from "libs/auth-context"
import { useMainSetup, useOnboardingStep } from "hooks/onboarding"

import { fonts } from "styles/fonts"

// screens
import { SignUp } from "screens/SignUp"
import { VerifyPhone } from "screens/VerifyPhone"
import { SetPin } from "screens/SetPin"
import { AddMoney } from "screens/AddMoney"
import { Login } from "screens/Login"

const EmptyScreen = () => (
    <View>
        <Text>Empty screen</Text>
    </View>
)

const OnboardingStack = createStackNavigator()
function OnboardingStackNavigator() {
    const { loading, onboardingStep } = useOnboardingStep()
    if (loading) {
        return <Loader />
    }

    const options: StackNavigationOptions = {
        header: (props) => <Header />,
    }

    let initalRoute = "SetPin"
    if (onboardingStep === "ADD_MONEY") {
        initalRoute = "AddMoney"
    }

    return (
        <OnboardingStack.Navigator screenOptions={options} initialRouteName={initalRoute}>
            <OnboardingStack.Screen name="SetPin" component={SetPin} />
            <OnboardingStack.Screen name="AddMoney" component={AddMoney} />
        </OnboardingStack.Navigator>
    )
}

const MainStack = createStackNavigator()
function MainStackNavigator() {
    const { loading, isNewAccount } = useMainSetup()

    if (loading) {
        return <Loader />
    }

    const initalRoute = isNewAccount ? "OnboardingStack" : "TransferTab"
    return (
        <MainStack.Navigator headerMode="none" initialRouteName={initalRoute}>
            <MainStack.Screen name="OnboardingStack" component={OnboardingStackNavigator} />
            <MainStack.Screen name="TransferTab" component={EmptyScreen} />
            <MainStack.Screen name="DepositWithdraw" component={EmptyScreen} />
            <MainStack.Screen name="AddMoney" component={EmptyScreen} />
            <MainStack.Screen name="Withdraw" component={EmptyScreen} />
            <MainStack.Screen name="WithdrawSettings" component={EmptyScreen} />
        </MainStack.Navigator>
    )
}

const PublicStack = createStackNavigator()
function PublicStackNavigator() {
    const authContext = useContext(AuthContext)
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
            {authContext?.hasPublicDetails ? (
                <PublicStack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
            ) : (
                <>
                    <PublicStack.Screen
                        name="SignUp"
                        component={SignUp}
                        options={{ headerShown: false }}
                    />

                    <PublicStack.Screen
                        name="VerifyPhone"
                        component={VerifyPhone}
                        options={{ title: "Verify number" }}
                    />
                </>
            )}
        </PublicStack.Navigator>
    )
}

const RootStack = createStackNavigator()
export function RootNavigator() {
    const authContext = useContext(AuthContext)

    return (
        <RootStack.Navigator headerMode="none">
            {authContext?.isLoggedIn ? (
                <RootStack.Screen name="Main" component={MainStackNavigator} />
            ) : (
                <RootStack.Screen name="PublicPage" component={PublicStackNavigator} />
            )}
        </RootStack.Navigator>
    )
}
