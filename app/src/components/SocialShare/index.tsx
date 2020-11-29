import React from "react"
import * as Sentry from "@sentry/react-native"
import WhatsAppIcon from "assets/icons/whatsapp.svg"
import InstagramIcon from "assets/icons/instagram.svg"
import TwitterIcon from "assets/icons/twitter.svg"
import Share, { Options } from "react-native-share"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { Text } from "react-native-elements"
import { trackEvent } from "libs/analytics"

type IProps = {
    platform: "whatsapp" | "messenger" | "instagram" | "twitter"
    shareText: string
}

export function SocialShare(props: IProps) {
    let image = null
    const shareOptions: Options & { social: Share.Social } = {
        title: "Share via",
        message: props.shareText,
        social: Share.Social.EMAIL,
    }

    switch (props.platform) {
        case "whatsapp": {
            image = <WhatsAppIcon />
            shareOptions.social = Share.Social.WHATSAPP
            break
        }

        case "instagram": {
            image = <InstagramIcon />
            shareOptions.social = Share.Social.INSTAGRAM
            break
        }

        case "twitter": {
            image = <TwitterIcon />
            shareOptions.social = Share.Social.TWITTER
            break
        }
    }

    const onPress = async () => {
        try {
            await Share.shareSingle(shareOptions)
            trackEvent(`Share via ${props.platform}`, {
                category: "Share",
                shareText: props.shareText,
            })
        } catch (err) {
            console.log(err)
            Sentry.captureException(err)
        }
    }

    return (
        <TouchableOpacity onPress={onPress}>
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
