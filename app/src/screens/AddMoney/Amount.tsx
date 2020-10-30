import React from "react"
import { formatCurrency } from "libs/helpers"
import { StyleSheet, View } from "react-native"
import { CheckBox } from "react-native-elements"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"
import { Amounts } from "./index"

type IProps = {
    selectedAmount: Amounts
    onSelectAmount: (amount: Amounts) => void
}
export function Amount(props: IProps) {
    return (
        <View style={styles.container}>
            <CheckBox
                containerStyle={styles.checkBoxContainer}
                textStyle={styles.checkBoxTitle}
                checkedIcon="circle"
                uncheckedIcon="circle"
                uncheckedColor={colorTheme.grey}
                title={`NGN ${formatCurrency(500)}`}
                checked={props.selectedAmount === "500"}
                onPress={() => props.onSelectAmount("500")}
            />
            <CheckBox
                containerStyle={styles.checkBoxContainer}
                textStyle={styles.checkBoxTitle}
                checkedIcon="circle"
                uncheckedIcon="circle"
                uncheckedColor={colorTheme.grey}
                title={`NGN ${formatCurrency(1500)}`}
                checked={props.selectedAmount === "1500"}
                onPress={() => props.onSelectAmount("1500")}
            />
            <CheckBox
                containerStyle={styles.checkBoxContainer}
                textStyle={styles.checkBoxTitle}
                checkedIcon="circle"
                uncheckedIcon="circle"
                uncheckedColor={colorTheme.grey}
                title={`NGN ${formatCurrency(3000)}`}
                checked={props.selectedAmount === "3000"}
                onPress={() => props.onSelectAmount("3000")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 25,
    },

    checkBoxContainer: {
        backgroundColor: "transparent",
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        borderWidth: 0,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingHorizontal: 30,
        paddingVertical: 25,
    },

    checkBoxTitle: {
        fontSize: 18,
        ...fonts.regular,
    },
})
