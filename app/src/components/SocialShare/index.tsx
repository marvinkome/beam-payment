import React from "react"
import WhatsAppIcon from "assets/icons/whatsapp.svg"
import MessengerIcon from "assets/icons/messenger.svg"
import InstagramIcon from "assets/icons/instagram.svg"
import TwitterIcon from "assets/icons/twitter.svg"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { Text } from "react-native-elements"

type IProps = {
    platform: "whatsapp" | "messenger" | "instagram" | "twitter"
    shareText: string
}

export function SocialShare(props: IProps) {
    let image = null

    switch (props.platform) {
        case "whatsapp": {
            image = <WhatsAppIcon />
            break
        }

        case "messenger": {
            image = <MessengerIcon />
            break
        }

        case "instagram": {
            image = <InstagramIcon />
            break
        }

        case "twitter": {
            image = <TwitterIcon />
            break
        }
    }

    return (
        <TouchableOpacity onPress={() => null}>
            <View style={{ alignItems: "center" }}>
                {image}
                <Text style={styles.label}>{props.platform}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    label: {
        textTransform: "capitalize",
        marginTop: 10,
        fontSize: 16,
    },
})
