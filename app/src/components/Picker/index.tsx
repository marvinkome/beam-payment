import React, { useCallback, useMemo, useRef } from "react"
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Input, Text } from "react-native-elements"
import { fonts } from "styles/fonts"
import { colorTheme } from "styles/theme"

const data = Array(50)
    .fill(0)
    .map((_, index) => `index-${index}`)

export function usePicker() {
    const sheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ["1%", "60%", "90%"], [])

    const PickerAction = () => {
        return (
            <View style={styles.pickerActionContainer}>
                {/* label */}
                <Text style={styles.labelText}>Bank name:</Text>

                {/* input */}
                <TouchableOpacity onPress={() => sheetRef.current?.snapTo(1)}>
                    <Input placeholder="Select bank name" editable={false} />
                </TouchableOpacity>
            </View>
        )
    }

    const Picker = () => (
        <View style={{ elevation: 999 }}>
            <BottomSheet ref={sheetRef} initialSnapIndex={-1} snapPoints={snapPoints}>
                <BottomSheetFlatList
                    data={data}
                    keyExtractor={(i) => i}
                    contentContainerStyle={{ elevation: 5, backgroundColor: "green" }}
                    renderItem={({ item }) => (
                        <View style={{ elevation: 4 }}>
                            <Text>{item}</Text>
                        </View>
                    )}
                />
            </BottomSheet>
        </View>
    )

    return { PickerAction, Picker }
}

export function Picker() {
    return null
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
})
