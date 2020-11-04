import { Theme } from "react-native-elements"
import { DefaultTheme } from "@react-navigation/native"
import { fonts } from "./fonts"

export const colorTheme = {
    primary: "#9175DB",
    backgroud: "#FFFFFF",

    white: "#FFFFFF",
    black: "#32294D",
    textLight: "hsla(255, 31%, 23%, 0.5)",
    grey: "#E8EAED",

    green: "#44CC00",
    red: "#DB7E75",
}

export const ElementsTheme: Theme = {
    colors: {
        ...colorTheme,
    },

    Text: {
        style: {
            fontSize: 16,
            ...fonts.regular,
        },

        h1Style: {
            fontSize: 30,
            ...fonts.semiBold,
        },

        h2Style: {
            fontSize: 25,
            ...fonts.semiBold,
        },

        h3Style: {
            fontSize: 20,
            letterSpacing: 0.8,
            ...fonts.semiBold,
        },
    },

    Button: {
        containerStyle: {
            marginBottom: 10,
            marginHorizontal: 15,
        },

        buttonStyle: {
            borderRadius: 50,
            padding: 15,
        },

        titleStyle: {
            ...fonts.semiBold,
            textTransform: "uppercase",
            letterSpacing: 1,
        },

        disabledStyle: {
            backgroundColor: colorTheme.primary + "80",
        },

        disabledTitleStyle: {
            color: colorTheme.white,
        },
    },

    Input: {
        placeholderTextColor: colorTheme.textLight,
        inputContainerStyle: {
            borderRadius: 10,
            borderWidth: 1,
            paddingHorizontal: 7,
            paddingVertical: 5,
            borderColor: colorTheme.black,
        },
        inputStyle: {
            fontSize: 16,
            letterSpacing: 0.32,
            paddingLeft: 10,
            ...fonts.regular,
        },

        labelStyle: {
            color: colorTheme.black,
            fontSize: 16,
            marginBottom: 20,
            ...fonts.semiBold,
        },
    },
}

export const NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: colorTheme.backgroud,
    },
}
