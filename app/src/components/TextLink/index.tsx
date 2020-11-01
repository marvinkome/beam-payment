import React from "react"
import { StyleSheet, Linking, Pressable } from "react-native"
import { Text } from "react-native-elements"
import { colorTheme } from "styles/theme"

type IProps = {
    children: string
    href?: string
    onPress?: () => void
    style?: any
}

export function TextLink(props: IProps) {
    const onPress = async () => {
        await Linking.openURL(props.href || "")
    }

    return (
        <Pressable onPress={props.onPress || onPress}>
            <Text style={{ ...styles.textStyle, ...props.style }}>{props.children}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    textStyle: {
        color: colorTheme.primary,
    },
})
