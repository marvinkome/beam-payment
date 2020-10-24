import { Theme } from "react-native-elements"
import { fonts } from "./fonts"

export const colorTheme = {
    primary: "#9175DB",
    backgroud: "#FFFFFF",

    black: "#32294D",
    grey: "#E8EAED",
}

export const ElementsTheme: Theme = {
    colors: {
        ...colorTheme,
    },

    Text: {
        style: {
            fontSize: 16,
            color: colorTheme.black,
            ...fonts.regular,
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
            fontSize: 16,
            fontFamily: "SourceSansPro-SemiBold",
            letterSpacing: 1,
        },
    },
}
