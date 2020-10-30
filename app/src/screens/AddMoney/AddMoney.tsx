import React from "react"
import { ScrollView, View } from "react-native"
import { Button, Text } from "react-native-elements"
import { Amounts } from "./index"
import { Amount } from "./Amount"

type IProps = {
    loading: boolean
    selectedAmount: Amounts
    onSelectAmount: (amount: Amounts) => void
    onContinue: () => void
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
            </View>

            <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Button
                    disabled={!props.selectedAmount}
                    onPress={props.onContinue}
                    loading={props.loading}
                    title="Continue"
                />
            </View>
        </ScrollView>
    )
}
