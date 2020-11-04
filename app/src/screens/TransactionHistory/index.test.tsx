import React from "react"
import { render } from "@testing-library/react-native"
import { HistoryItem } from "./HistoryItem"
import { TransactionHistoryScreen } from "./TransactionHistory"

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

    test("", () => {
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

        const queries = render(<TransactionHistoryScreen data={data} />)

        expect(queries.getAllByTestId("historyItem")).toHaveLength(3)
    })
})
