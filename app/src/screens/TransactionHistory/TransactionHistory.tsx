import React from "react"
import { FlatList, View, StyleSheet } from "react-native"
import { Text } from "react-native-elements"
import { colorTheme } from "styles/theme"
import { HistoryItem } from "./HistoryItem"

type IProps = {
    data: {
        id: string
        amount: number
        between: string
        type: "credit" | "debit"
        timestamp: string
    }[]
}
export function TransactionHistoryScreen(props: IProps) {
    return (
        <View style={styles.container}>
            <FlatList
                data={props.data}
                renderItem={({ item }: any) => <HistoryItem {...item} />}
                keyExtractor={(item) => `${item.id}`}
                ListEmptyComponent={() => (
                    <View style={{ padding: 20 }}>
                        <Text style={{ textAlign: "center" }}>
                            You haven't made any transactions yet
                        </Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: colorTheme.grey,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
})
