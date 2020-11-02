import React from "react"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs"
import { Text } from "react-native-elements"
import { colorTheme } from "styles/theme"
import { fonts } from "styles/fonts"

export function TabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
    return (
        <View style={styles.container}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key]
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name

                const isFocused = state.index === index

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    })

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name)
                    }
                }

                let containerStyle: any = styles.tab
                let textStyle: any = styles.tabText

                if (isFocused) {
                    containerStyle = { ...containerStyle, ...styles.selectedTab }
                    textStyle = { ...textStyle, ...styles.selectedTabText }
                }

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        key={index}
                        style={containerStyle}>
                        <Text style={textStyle}>{label}</Text>
                        {options.tabBarIcon &&
                            options.tabBarIcon({ focused: isFocused, color: textStyle.color })}
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: colorTheme.grey,
        alignSelf: "center",
        borderRadius: 50,
        marginTop: 25,
        marginHorizontal: 15,
        overflow: "hidden",
    },

    tab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
    },
    selectedTab: {
        backgroundColor: colorTheme.primary,
    },

    tabText: {
        marginRight: 10,
        textTransform: "uppercase",
        color: colorTheme.primary + "80",
        letterSpacing: 1,
        fontSize: 14,
        ...fonts.semiBold,
    },
    selectedTabText: {
        color: colorTheme.white,
    },
})
