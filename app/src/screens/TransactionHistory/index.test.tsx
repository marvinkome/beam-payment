import React from "react"
import mockdate from "mockdate"
import { MockedProvider } from "@apollo/client/testing"
import { render, waitFor, within, fireEvent } from "@testing-library/react-native"
import { HistoryItem } from "./HistoryItem"
import { TransactionHistoryScreen } from "./TransactionHistory"
import { TransactionHistory, TRANSACTION_HISTORY } from "./index"
import { useNavigation } from "@react-navigation/native"
import { routes } from "libs/navigator"

describe("TransactionHistory", () => {
    test("<HistoryItem />", () => {
        const queries = render(
            <HistoryItem
                id="0"
                amount={200}
                between="+2349087573383"
                type="credit"
                fee={5}
                feeType="SMS"
                timestamp={`${new Date("2020-11-04T13:24:00").getTime()}`}
            />,
        )

        expect(queries.getByA11yHint("credited 200")).toBeTruthy()
        expect(queries.getByText("09087573383")).toBeTruthy()
        expect(queries.getByText("+NGN 5 - SMS fee")).toBeTruthy()

        queries.update(
            <HistoryItem
                id="0"
                amount={200}
                between="+2349087573383"
                type="credit"
                fee={5}
                feeType="DEPOSIT"
                timestamp={`${new Date("2020-11-04T13:24:00").getTime()}`}
            />,
        )

        expect(queries.getByText("+NGN 5")).toBeTruthy()

        fireEvent.press(queries.getByTestId("historyItem"))
        expect(useNavigation().navigate).toBeCalledWith(routes.main.transferTab.transfer, {
            phoneNumber: "09087573383",
        })
    })

    test("<TransactionHistoryScreen />", () => {
        const data = [
            {
                // receiving
                id: "0",
                amount: 1200,
                between: "+2349087573383",
                type: "credit" as any,
                fee: 0,
                feeType: null,
                timestamp: `${new Date("2020-11-04T15:24:00").getTime()}`,
            },
            {
                // sending
                id: "1",
                amount: 1200,
                between: "+2349087573383",
                type: "debit" as any,
                fee: 0,
                feeType: null,
                timestamp: `${new Date("2020-11-04T15:25:00").getTime()}`,
            },
            {
                // sending with sms
                id: "2",
                amount: 400,
                between: "+2349087573383",
                type: "debit" as any,
                fee: 5,
                feeType: "SMS",
                timestamp: `${new Date("2020-11-04T13:26:00").getTime()}`,
            },
            {
                // deposit
                id: "3",
                amount: 500,
                between: "Deposit",
                type: "credit" as any,
                fee: 2.86,
                feeType: "DEPOSIT",
                timestamp: `${new Date("2020-10-04T15:24:00").getTime()}`,
            },
            {
                // withdrawal
                id: "4",
                amount: 200,
                between: "Withdraw",
                type: "debit" as any,
                fee: 11,
                feeType: "WITHDRAW",
                timestamp: `${new Date("2020-10-04T15:24:00").getTime()}`,
            },
        ]

        const queries = render(
            <TransactionHistoryScreen loading={false} data={data} refetch={jest.fn()} />,
        )

        expect(queries.getAllByTestId("historyItem")).toHaveLength(5)

        const recieveTransaction = within(queries.getAllByTestId("historyItem")[0])
        expect(recieveTransaction.queryByText(/fee/)).toBeFalsy()

        const smsTransaction = within(queries.getAllByTestId("historyItem")[2])
        expect(smsTransaction.getByText("+NGN 5 - SMS fee")).toBeTruthy()

        const depositTransaction = within(queries.getAllByTestId("historyItem")[3])
        expect(depositTransaction.getByText("Deposit")).toBeTruthy()
        expect(depositTransaction.getByText("+NGN 2.86")).toBeTruthy()

        const withdrawTransaction = within(queries.getAllByTestId("historyItem")[4])
        expect(withdrawTransaction.getByText("Withdraw")).toBeTruthy()
        expect(withdrawTransaction.getByText("+NGN 11")).toBeTruthy()
    })

    test("<TransactionHistory />", async () => {
        mockdate.set(1604507740641)

        const mock = {
            request: {
                query: TRANSACTION_HISTORY,
            },
            result: {
                data: {
                    me: {
                        id: "user_id",
                        accountBalance: 300,
                    },
                    transactionHistory: [
                        {
                            id: "transactionId0",
                            transactionType: "CREDIT",
                            amount: "100",
                            createdAt: new Date("2020-11-02T10:24:00").getTime(),
                            details: "+2349087543383",
                            between: {
                                phoneNumber: "+2349087543383",
                            },
                            fee: {
                                amount: 0,
                                type: null,
                            },
                        },
                        {
                            id: "transactionId1",
                            transactionType: "DEBIT",
                            amount: "150",
                            createdAt: new Date("2020-11-03T09:24:00").getTime(),
                            details: "+2349087543383",
                            between: {
                                phoneNumber: "+2349087543383",
                            },
                            fee: {
                                amount: 0,
                                type: null,
                            },
                        },
                        {
                            id: "transactionId2",
                            transactionType: "CREDIT",
                            amount: "500",
                            createdAt: new Date("2020-11-04T10:24:00").getTime(),
                            details: "Deposit",
                            between: null,
                            fee: {
                                amount: 2.86,
                                type: "DEPOSIT",
                            },
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
