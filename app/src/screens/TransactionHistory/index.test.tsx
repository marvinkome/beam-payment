import React from "react"
import mockdate from "mockdate"
import { MockedProvider } from "@apollo/client/testing"
import { render, waitFor, within } from "@testing-library/react-native"
import { HistoryItem } from "./HistoryItem"
import { TransactionHistoryScreen } from "./TransactionHistory"
import { TransactionHistory, TRANSACTION_HISTORY } from "./index"

describe("TransactionHistory", () => {
    test("<HistoryItem />", () => {
        const queries = render(
            <HistoryItem
                id="0"
                amount={200}
                between="+2349087573383"
                type="credit"
                timestamp={`${new Date("2020-11-04T13:24:00").getTime()}`}
            />,
        )

        expect(queries.getByA11yHint("credited 200")).toBeTruthy()
        expect(queries.getByText("09087573383")).toBeTruthy()
    })

    test("<TransactionHistoryScreen />", () => {
        const data = [
            {
                id: "0",
                amount: 1200,
                between: "+2349087573383",
                type: "credit" as any,
                timestamp: `${new Date("2020-11-04T15:24:00").getTime()}`,
            },
            {
                id: "1",
                amount: 400,
                between: "+2349087573383",
                type: "debit" as any,
                timestamp: `${new Date("2020-11-04T13:24:00").getTime()}`,
            },
            {
                id: "2",
                amount: 200,
                between: "+2349087573383",
                type: "debit" as any,
                timestamp: `${new Date("2020-10-04T15:24:00").getTime()}`,
            },
        ]

        const queries = render(
            <TransactionHistoryScreen loading={false} data={data} refetch={jest.fn()} />,
        )

        expect(queries.getAllByTestId("historyItem")).toHaveLength(3)
    })

    test("<TransactionHistory />", async () => {
        mockdate.set(1604507740641)

        const mock = {
            request: {
                query: TRANSACTION_HISTORY,
            },
            result: {
                data: {
                    transactionHistory: [
                        {
                            id: "transactionId0",
                            transactionType: "CREDIT",
                            amount: "100",
                            createdAt: new Date("2020-11-02T10:24:00").getTime(),
                            between: {
                                phoneNumber: "+2349087543383",
                            },
                        },
                        {
                            id: "transactionId1",
                            transactionType: "DEBIT",
                            amount: "150",
                            createdAt: new Date("2020-11-03T09:24:00").getTime(),
                            between: {
                                phoneNumber: "+2349087543383",
                            },
                        },
                        {
                            id: "transactionId2",
                            transactionType: "CREDIT",
                            amount: "500",
                            createdAt: new Date("2020-11-04T10:24:00").getTime(),
                            between: null,
                        },
                    ],
                },
            },
        }

        const queries = render(
            <MockedProvider mocks={[mock]} addTypename={false}>
                <TransactionHistory />
            </MockedProvider>,
        )

        await waitFor(() => {
            expect(queries.getAllByTestId("historyItem")).toHaveLength(3)
        })

        const firstItem = within(queries.getAllByTestId("historyItem")[0])
        expect(firstItem.getByText("10:24 AM")).toBeTruthy()

        mockdate.reset()
    })
})
