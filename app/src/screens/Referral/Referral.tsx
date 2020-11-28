import React from "react"
import InviteSmallIcon from "assets/images/invite-small.svg"
import { ScrollView, View, StyleSheet } from "react-native"
import { Text } from "react-native-elements"
import { colorTheme } from "styles/theme"
import { SocialShare } from "components/SocialShare"
import { ShareInput } from "components/ShareInput"

type IProps = {
    link: string
}

export function ReferralScreen(props: IProps) {
    const shareText: string =
        "I’m inviting you to sign up for Beam: Pay anyone with a phone " +
        "number in seconds. \n" +
        `${props.link} \n` +
        "Get ₦100 for every friend you invite."

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerImage}>
                <InviteSmallIcon />
            </View>

            <View style={{ alignItems: "center" }}>
                <Text h1>Get ₦100 for every invite</Text>

                <Text style={styles.headerSmallText}>
                    Invite friends to Beam and get paid ₦100 per invite
                </Text>
            </View>

            <View style={styles.shareContainer}>
                <Text h3 style={styles.shareHeader}>
                    Share through
                </Text>

                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    {/* whatsapp share */}
                    <SocialShare platform="whatsapp" shareText={shareText} />

                    {/* instagram share */}
                    <SocialShare platform="instagram" shareText={shareText} />

                    {/* twitter share */}
                    <SocialShare
                        platform="twitter"
                        shareText={shareText + "\n #PayWithBeam @usebeamapp"}
                    />
                </View>

                <Text h3 style={styles.shareHeader}>
                    OR
                </Text>

                <View>
                    <ShareInput link={props.link} />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 25,
    },

    headerImage: {
        alignItems: "center",
        marginBottom: 30,
    },

    headerSmallText: {
        textAlign: "center",
        marginTop: 15,
        marginHorizontal: 30,
    },

    shareContainer: {
        marginVertical: 10,
    },

    shareHeader: {
        color: colorTheme.textLight,
        textAlign: "center",
        marginVertical: 35,
    },
})
