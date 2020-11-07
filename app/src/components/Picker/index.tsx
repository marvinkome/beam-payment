import React, { useState } from "react"
import PickerModal from "react-native-picker-modal-view"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Input, Text } from "react-native-elements"
import { PickerHeader } from "./PickerHeader"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"

function filterItems(items: any[], searchText: string) {
    return items.filter(
        (l) => l.Name.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1,
    )
}

type IProps = {
    label?: string
    placeholder?: string
    searchPlaceholder?: string
    pickerHeaderTitle?: string
    data: Array<{ Name: string; Value: string; Id: string }>
}
export function Picker(props: IProps) {
    const [searchText, setSearchText] = useState("")
    const [selected, setSelected] = useState<{ Name: string; Value: string; Id: string } | null>(
        null,
    )
    const [isOpen, setIsOpen] = useState(false)

    return (
        <View style={styles.pickerActionContainer}>
            {/* label */}
            <Text style={styles.labelText}>{props.label}</Text>

            <PickerModal
                items={filterItems(props.data, searchText)}
                onSelected={(item: any) => {
                    setIsOpen(false)
                    setSelected(item)
                    return item
                }}
                ModalProps={{ visible: isOpen, onRequestClose: () => setIsOpen(false) }}
                autoSort={true}
                showToTopButton={false}
                renderSearch={(_, close) => (
                    <PickerHeader
                        searchPlaceholder={props.searchPlaceholder}
                        headerTitle={props.pickerHeaderTitle}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        onClose={close}
                    />
                )}
                renderListItem={(_, item) => <Text style={styles.item}>{item.Name}</Text>}
                renderSelectView={() => (
                    <TouchableOpacity onPress={() => setIsOpen(true)}>
                        <Input
                            placeholder={props.placeholder || "Select item"}
                            editable={false}
                            value={selected?.Name}
                        />
                    </TouchableOpacity>
                )}
                onClosed={() => setIsOpen(false)}
                onBackButtonPressed={() => setIsOpen(false)}
                onEndReached={() => null}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    pickerActionContainer: {
        marginBottom: 15,
    },
    labelText: {
        color: colorTheme.black,
        fontSize: 16,
        marginBottom: 20,
        marginHorizontal: 10,
        ...fonts.semiBold,
    },
    item: {
        paddingHorizontal: 15,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: colorTheme.grey,
    },
})
