import React from "react"
import { MockedProvider } from "@apollo/client/testing"
import { render, waitFor } from "@testing-library/react-native"
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

    const query = render(
        <MockedProvider mocks={[mock]} addTypename={false}>
            <>
                {/* @ts-ignore */}
                <Header navigation={{ goBack: jest.fn(), previous: undefined }} />
            </>
        </MockedProvider>,
    )

    expect(query.getByText("0")).toBeTruthy()

    await waitFor(() => {
        expect(query.getByText("500")).toBeTruthy()
    })
})
