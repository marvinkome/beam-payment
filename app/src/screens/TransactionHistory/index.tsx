import React, { useEffect } from "react"
import orderBy from "lodash.orderby"
import { gql, useQuery } from "@apollo/client"
import { TransactionHistoryScreen } from "./TransactionHistory"
import { useNavigation } from "@react-navigation/native"

export const TRANSACTION_HISTORY = gql`
    query TransactionHistory {
        transactionHistory {
            id
            transactionType
            amount
            createdAt
            between {
                phoneNumber
            }
        }
    }
`

function useTransactionHistory() {
    const { data, loading, refetch } = useQuery(TRANSACTION_HISTORY)
    return {
        history: (data?.transactionHistory as any[]) || [],
        refetch,
        loading,
    }
}

export function TransactionHistory() {
    const { history, refetch, loading } = useTransactionHistory()
    const navigation = useNavigation()

    useEffect(() => {
        navigation.addListener("focus", async () => {
            await refetch()
        })
    }, [])

    const formattedData = orderBy(history, "createdAt", "desc").reduce((allHistory, history) => {
        let item = {
            id: history.id,
            amount: history.amount,
            between: history.between?.phoneNumber,
            type: history.transactionType.toLowerCase(),
            timestamp: history.createdAt,
        }

        allHistory.push(item)
        return allHistory
    }, [])

    return <TransactionHistoryScreen data={formattedData} loading={loading} refetch={refetch} />
}
