import React, { useCallback } from "react"
import orderBy from "lodash.orderby"
import { gql, useQuery } from "@apollo/client"
import { TransactionHistoryScreen } from "./TransactionHistory"
import { useFocusEffect } from "@react-navigation/native"

export const TRANSACTION_HISTORY = gql`
    query TransactionHistory {
        me {
            id
            accountBalance
        }

        transactionHistory {
            id
            transactionType
            amount
            createdAt
            details
            between {
                phoneNumber
            }
            fee {
                amount
                type
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

    useFocusEffect(
        useCallback(() => {
            refetch()
        }, []),
    )

    const formattedData = orderBy(history, "createdAt", "desc").reduce((allHistory, history) => {
        let item = {
            id: history.id,
            amount: history.amount,
            between: history.details,
            fee: history.fee?.amount,
            feeType: history.fee?.type,
            type: history.transactionType.toLowerCase(),
            timestamp: history.createdAt,
        }

        allHistory.push(item)
        return allHistory
    }, [])

    return <TransactionHistoryScreen data={formattedData} loading={loading} refetch={refetch} />
}
