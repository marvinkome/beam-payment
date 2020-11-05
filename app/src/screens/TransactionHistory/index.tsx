import React from "react"
import orderBy from "lodash.orderby"
import { gql, useQuery } from "@apollo/client"
import { TransactionHistoryScreen } from "./TransactionHistory"

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
    const { data, loading } = useQuery(TRANSACTION_HISTORY)
    return {
        history: (data?.transactionHistory as any[]) || [],
        loading,
    }
}

export function TransactionHistory() {
    const { history } = useTransactionHistory()

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

    return <TransactionHistoryScreen data={formattedData} />
}
