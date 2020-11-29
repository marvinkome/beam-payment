import React from "react"
import Clipboard from "@react-native-community/clipboard"
import { StyleSheet, ToastAndroid, View } from "react-native"
import { Button, Text } from "react-native-elements"
import { colorTheme } from "styles/theme"
import { trackEvent } from "libs/analytics"

type IProps = {
    link: string
}

export function ShareInput(props: IProps) {
    const onPress = () => {
        Clipboard.setString(props.link)
        ToastAndroid.show("Copied!", ToastAndroid.SHORT)
        trackEvent(`Copy share link`, {
            category: "Share",
            shareText: props.link,
        })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.mainText} numberOfLines={1}>
                {props.link}
            </Text>

            <Button
                containerStyle={{ marginTop: 10 }}
                buttonStyle={{ paddingHorizontal: 25, paddingVertical: 10 }}
                titleStyle={{ textTransform: "capitalize" }}
                onPress={onPress}
                title="Copy"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colorTheme.primary,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
    },

    mainText: {
        flex: 1,
        marginLeft: 25,
    },
})
