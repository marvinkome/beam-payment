import { StyleSheet } from "react-native"
import { colorTheme } from "./theme"

export const tabBar = StyleSheet.create({
    barStyle: {
        backgroundColor: colorTheme.grey,
        width: "85%",
        alignSelf: "center",
        borderRadius: 50,
        elevation: 0,
        marginVertical: 25,
    },

    tabStyle: {
        borderWidth: 0,
    },
})
