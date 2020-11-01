import React from "react"
import { View } from "react-native"

export const PayWithFlutterwave = jest.fn((props: any) => (
    <View>
        {props.customButton({
            disabled: false,
            onPress: jest.fn(() =>
                props.onRedirect({
                    status: "successful",
                    tx_ref: "a-short-id",
                    transaction_id: "a-transaction-id",
                }),
            ),
        })}
    </View>
))
