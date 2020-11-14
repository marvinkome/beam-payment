import React from "react"
import { CustomButtonProps } from "flutterwave-react-native/dist/PaywithFlutterwaveBase"
import { ScrollView, View } from "react-native"
import { Button, Text } from "react-native-elements"
import { Amounts } from "./index"
import { Amount } from "./Amount"
import { TextLink } from "components/TextLink"

type IProps = {
    loading: boolean
    selectedAmount: Amounts
    isOnboarding?: boolean
    skipOnboarding?: () => void
    onSelectAmount: (amount: Amounts) => void
    renderContinueBtn: (renderButton: (props: CustomButtonProps) => React.ReactNode) => JSX.Element
}
export function AddMoneyScreen(props: IProps) {
    return (
        <ScrollView contentContainerStyle={{ flex: 1, paddingVertical: 30 }}>
            <Text h3 style={{ paddingHorizontal: 20 }}>
                Add money to your account
            </Text>

            <View style={{ marginVertical: 30 }}>
                <Text style={{ paddingHorizontal: 20 }}>How much do you want to add?</Text>

                <Amount
                    selectedAmount={props.selectedAmount}
                    onSelectAmount={props.onSelectAmount}
                />

                {props.isOnboarding && (
                    <TextLink onPress={props.skipOnboarding} style={{ paddingHorizontal: 20 }}>
                        Skip for now
                    </TextLink>
                )}
            </View>

            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Text style={{ textAlign: "center", marginBottom: 15 }}>+2% deposit fee </Text>

                {props.renderContinueBtn((btnProps) => (
                    <Button
                        loading={props.loading}
                        disabled={!props.selectedAmount || btnProps.disabled}
                        onPress={btnProps.onPress}
                        title="Continue"
                    />
                ))}
            </View>
        </ScrollView>
    )
}
