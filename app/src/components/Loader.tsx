import React from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { Text } from "react-native-elements"
import { colorTheme } from "styles/theme"

export function Loader({ text }: { text?: string }) {
    return (
        <View style={styles.container}>
            <ActivityIndicator color={colorTheme.primary} size="large" />
            {text && <Text style={{ marginTop: 30 }}>{text}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorTheme.backgroud,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})
