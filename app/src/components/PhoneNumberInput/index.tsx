import React from "react"
import CountryIcon from "assets/icons/country.svg"
import { StyleSheet, View, ViewStyle } from "react-native"
import { Input, InputProps, Text } from "react-native-elements"
import { colorTheme } from "styles/theme"

type IProps = {
    withIcon?: boolean
    containerStyle?: ViewStyle
    placeholder?: string
    label?: string
    inputProps?: InputProps
    value: string
    onChange: (text: string) => void
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
            inputStyle={{ paddingLeft: 0, alignItems: "center" }}
            keyboardType="number-pad"
            label={props.label}
            placeholder={props.placeholder || "Enter phone number"}
            renderErrorMessage={false}
            value={props.value}
            onChangeText={props.onChange}
            {...props.inputProps}
        />
    )
}

const styles = StyleSheet.create({
    leftIconContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: -1,
    },
})
