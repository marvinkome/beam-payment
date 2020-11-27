import React from "react"
import InviteSmallIcon from "assets/images/invite-small.svg"
import { ScrollView, View, StyleSheet } from "react-native"
import { Text } from "react-native-elements"
import { colorTheme } from "styles/theme"
import { SocialShare } from "components/SocialShare"
import { ShareInput } from "components/ShareInput"

export function ReferralScreen() {
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

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    {/* whatsapp share */}
                    <SocialShare
                        platform="whatsapp"
                        shareText="I'm inviting you to sign up for Beam;"
                    />

                    {/* messenger share */}
                    <SocialShare
                        platform="messenger"
                        shareText="I'm inviting you to sign up for Beam;"
                    />

                    {/* instagram share */}
                    <SocialShare
                        platform="instagram"
                        shareText="I'm inviting you to sign up for Beam;"
                    />

                    {/* twitter share */}
                    <SocialShare
                        platform="twitter"
                        shareText="I'm inviting you to sign up for Beam;"
                    />
                </View>

                <Text h3 style={styles.shareHeader}>
                    OR
                </Text>

                <View>
                    <ShareInput link="https://usebeam.app/m124085bi0bwi08ljs0" />
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
