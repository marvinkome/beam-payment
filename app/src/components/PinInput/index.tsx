import React from "react"
import {
    CodeField,
    Cursor,
    isLastFilledCell,
    MaskSymbol,
    useBlurOnFulfill,
    useClearByFocusCell,
} from "react-native-confirmation-code-field"
import { StyleSheet, View } from "react-native"
import { Text } from "react-native-elements"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"

type IProps = {
    codeLength: number
    value: string
    onChange: (text: string) => void
    secure?: boolean
    testID?: string
}

export function PinInput(props: IProps) {
    const ref = useBlurOnFulfill({ value: props.value, cellCount: props.codeLength })
    const [cellProps, getCellOnLayoutHandler] = useClearByFocusCell({
        value: props.value,
        setValue: props.onChange,
    })

    const renderCell = ({ index, symbol, isFocused }: any) => {
        let textChild: any = "-"

        if (symbol) {
            if (props.secure) {
                textChild = (
                    <MaskSymbol
                        maskSymbol="•"
                        isLastFilledCell={isLastFilledCell({ index, value: props.value })}>
                        {symbol}
                    </MaskSymbol>
                )
            } else {
                textChild = symbol
            }
        } else if (isFocused) {
            textChild = <Cursor />
        }

        return (
            <Text key={index} style={styles.cell} onLayout={getCellOnLayoutHandler(index)}>
                {textChild}
            </Text>
        )
    }

    return (
        <View>
            <CodeField
                ref={ref}
                {...cellProps}
                value={props.value}
                onChangeText={props.onChange}
                cellCount={props.codeLength}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={renderCell}
                testID={props.testID}
                autoFocus
            />
        </View>
    )
}

const styles = StyleSheet.create({
    codeFieldRoot: {
        marginHorizontal: 20,
        justifyContent: "space-evenly",
    },
    cell: {
        width: 45,
        height: 45,
        lineHeight: 43,
        fontSize: 18,
        borderWidth: 1,
        borderColor: colorTheme.textLight,
        borderRadius: 10,
        textAlign: "center",
        ...fonts.semiBold,
    },
})
