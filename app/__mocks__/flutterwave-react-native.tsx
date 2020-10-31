import React from "react"
import { View } from "react-native"

const onContinue = jest.fn()
export const PayWithFlutterwave = jest.fn(({ customButton }: any) => (
    <View>{customButton({ disabled: false, onPress: onContinue })}</View>
))
