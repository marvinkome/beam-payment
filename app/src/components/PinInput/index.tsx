import React from "react"
import CodeInput, { CodeInputProps } from "react-native-confirmation-code-input"
import { StyleSheet, View } from "react-native"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"

type IProps = {
    codeLength: number
    secure?: boolean
    testID?: string
}

export function PinInput(props: IProps) {
    return (
        <View testID={props.testID}>
            <CodeInput
                codeLength={props.codeLength}
                secureTextEntry={props.secure}
                onFulfill={() => null}
                keyboardType="numeric"
                autoFocus={false}
                space={17}
                size={50}
                activeColor={colorTheme.black}
                inactiveColor={colorTheme.black}
                containerStyle={styles.container}
                codeInputStyle={styles.input}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    input: {
        borderRadius: 5,
        fontSize: 18,
        borderColor: colorTheme.textLight,
        ...fonts.regular,
    },
})
