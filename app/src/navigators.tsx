import React, { useContext } from "react"
import { View, Text } from "react-native"
import { TabBar } from "components/TabBar"
import { Header } from "components/Header"
import { Loader } from "components/Loader"
import { Icon } from "react-native-elements"
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { AuthContext } from "libs/auth-context"
import { useMainSetup, useOnboardingStep } from "hooks/onboarding"
import { routes } from "libs/navigator"
import { fonts } from "styles/fonts"

// screens
import { Login } from "screens/Login"
import { SignUp } from "screens/SignUp"
import { VerifyPhone } from "screens/VerifyPhone"
import { SetPin } from "screens/SetPin"
import { AddMoney } from "screens/AddMoney"
import { Transfer } from "screens/Transfer"

const EmptyScreen = () => (
    <View>
        <Text>Empty screen</Text>
    </View>
)

const TransferTab = createMaterialTopTabNavigator()
function TransferTabNavigator() {
    return (
        <TransferTab.Navigator tabBar={(props) => <TabBar {...props} />}>
            <TransferTab.Screen
                name={routes.main.transferTab.transfer}
                component={Transfer}
                options={{
                    title: "Transfer",
                    tabBarIcon: ({ color }) => (
                        <Icon name="swap" type="antdesign" size={20} color={color} />
                    ),
                }}
            />

            <TransferTab.Screen
                name={routes.main.transferTab.transactionHistory}
                component={EmptyScreen}
                options={{
                    title: "History",
                    tabBarIcon: ({ color }) => (
                        <Icon name="clockcircleo" type="antdesign" size={18} color={color} />
                    ),
                }}
            />
        </TransferTab.Navigator>
    )
}

const OnboardingStack = createStackNavigator()
function OnboardingStackNavigator() {
    const { loading, onboardingStep } = useOnboardingStep()
    if (loading) {
        return <Loader />
    }

    let initalRoute: string = routes.main.onboarding.setPin
    if (onboardingStep === "ADD_MONEY") {
        initalRoute = routes.main.onboarding.addMoney
    }

    return (
        <OnboardingStack.Navigator headerMode="none" initialRouteName={initalRoute}>
            <OnboardingStack.Screen name={routes.main.onboarding.setPin} component={SetPin} />
            <OnboardingStack.Screen name={routes.main.onboarding.addMoney} component={AddMoney} />
        </OnboardingStack.Navigator>
    )
}

const MainStack = createStackNavigator()
function MainStackNavigator() {
    const { loading, isNewAccount } = useMainSetup()

    if (loading) {
        return <Loader />
    }

    const options: StackNavigationOptions = {
        header: (props) => <Header />,
    }

    const initialRoute = isNewAccount ? routes.main.onboarding.index : "TransferTab"
    return (
        <MainStack.Navigator screenOptions={options} initialRouteName={initialRoute}>
            <MainStack.Screen
                name={routes.main.onboarding.index}
                component={OnboardingStackNavigator}
            />
            <MainStack.Screen
                name={routes.main.transferTab.index}
                component={TransferTabNavigator}
            />
            <MainStack.Screen name="DepositWithdraw" component={EmptyScreen} />
            <MainStack.Screen name="AddMoney" component={AddMoney} />
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
                    name={routes.public.login}
                    component={Login}
                    options={{ headerShown: false }}
                />
            ) : (
                <>
                    <PublicStack.Screen
                        name={routes.public.signUp}
                        component={SignUp}
                        options={{ headerShown: false }}
                    />

                    <PublicStack.Screen
                        name={routes.public.verifyPhone}
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
            {!authContext?.isLoggedIn ? (
                <RootStack.Screen name={routes.main.index} component={MainStackNavigator} />
            ) : (
                <RootStack.Screen name={routes.public.index} component={PublicStackNavigator} />
            )}
        </RootStack.Navigator>
    )
}
