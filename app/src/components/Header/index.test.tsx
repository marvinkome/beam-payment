import React from "react"
import { MockedProvider } from "@apollo/client/testing"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { GET_ACCOUNT_BALANCE, Header } from "./index"

test("Header", async () => {
    const mock = {
        request: {
            query: GET_ACCOUNT_BALANCE,
        },
        result: {
            data: {
                me: {
                    id: "user_id",
                    accountBalance: 500,
                },
            },
        },
    }

    const navigate = jest.fn()
    const query = render(
        <MockedProvider mocks={[mock]} addTypename={false}>
            <>
                {/* @ts-ignore */}
                <Header navigation={{ goBack: jest.fn(), navigate }} />
            </>
        </MockedProvider>,
    )

    expect(query.queryByText("0")).toBeFalsy()

    await waitFor(() => {
        expect(query.getByText("500")).toBeTruthy()
    })

    fireEvent.press(query.getByText("500"))
    expect(navigate).toBeCalledWith("CashSettings")
})
