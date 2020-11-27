import React from "react"
import { StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-elements"
import { colorTheme } from "styles/theme"

type IProps = {
    link: string
}

export function ShareInput(props: IProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.mainText} numberOfLines={1}>
                {props.link}
            </Text>

            <Button
                containerStyle={{ marginTop: 10 }}
                buttonStyle={{ paddingHorizontal: 25, paddingVertical: 10 }}
                titleStyle={{ textTransform: "capitalize" }}
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
