import React from "react"
import { ActivityIndicator, View } from "react-native"
import { colorTheme } from "styles/theme"

export function Loader() {
    return (
        <View style={{ backgroundColor: colorTheme.backgroud, flex: 1, justifyContent: "center" }}>
            <ActivityIndicator color={colorTheme.primary} size="large" />
        </View>
    )
}
