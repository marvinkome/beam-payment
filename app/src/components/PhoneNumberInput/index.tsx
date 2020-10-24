import React from "react"
import CountryIcon from "assets/icons/country.svg"
import { StyleSheet, View, ViewStyle } from "react-native"
import { Input, Text } from "react-native-elements"
import { colorTheme } from "styles/theme"

type IProps = {
    withIcon?: boolean
    containerStyle?: ViewStyle
}
export function PhoneNumberInput(props: IProps) {
    const LeftIcon = (
        <View style={styles.leftIconContainer}>
            {props.withIcon && <CountryIcon testID="countryIcon" style={{ marginLeft: 15 }} />}
            <Text style={{ marginLeft: 15, marginRight: 5 }}>+234</Text>
        </View>
    )

    return (
        <Input
            inputContainerStyle={{ ...props.containerStyle }}
            leftIcon={LeftIcon}
            inputStyle={{ paddingLeft: 0 }}
            keyboardType="number-pad"
            placeholder="Enter phone number"
        />
    )
}

const styles = StyleSheet.create({
    leftIconContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
})
