import React from "react"
import {} from "@react-native-community/hooks"
import { StyleSheet, View } from "react-native"
import { Icon, Text, SearchBar } from "react-native-elements"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"

type IProps = {
    searchText: string
    searchPlaceholder?: string
    headerTitle?: string
    onClose: () => void
    setSearchText: (text: string) => void
}
export function PickerHeader(props: IProps) {
    return (
        <View style={styles.pickerListHeader}>
            {/* header */}
            <View style={styles.headerTitleSection}>
                <Icon
                    accessibilityLabel="closeBtn"
                    name="x"
                    type="feather"
                    size={27}
                    onPress={props.onClose}
                />

                <Text style={styles.headerTitle}>{props.headerTitle || "Select"}</Text>
            </View>

            {/* search */}
            <SearchBar
                value={props.searchText}
                onChangeText={props.setSearchText}
                containerStyle={styles.searchContainer}
                inputContainerStyle={styles.searchInputContainer}
                placeholderTextColor={colorTheme.textLight}
                inputStyle={{ color: colorTheme.black }}
                searchIcon={{ name: "search", type: "feather", size: 20 }}
                placeholder={props.searchPlaceholder || "Search..."}
                lightTheme
            />

            <Text style={styles.bankHeaderText}>Banks</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    pickerListHeader: {
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colorTheme.grey,
        backgroundColor: colorTheme.backgroud,
    },

    headerTitleSection: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 15,
    },

    headerTitle: {
        fontSize: 18,
        textAlign: "center",
        marginLeft: 30,
        ...fonts.semiBold,
    },

    searchContainer: {
        backgroundColor: "transparent",
        borderTopWidth: 1,
        borderBottomWidth: 0,
        paddingHorizontal: 15,
        paddingTop: 10,
    },

    searchInputContainer: {
        borderColor: "transparent",
        backgroundColor: colorTheme.grey,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 7,
        paddingVertical: 5,
    },

    bankHeaderText: {
        paddingHorizontal: 15,
        paddingTop: 10,

        fontSize: 18,
        ...fonts.semiBold,
    },
})
