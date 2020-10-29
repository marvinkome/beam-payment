import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MockedProvider } from "@apollo/client/testing"
import { ToastAndroid } from "react-native"
import { AUTH_TOKEN } from "libs/keys"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { smsConfirmationObj } from "store/authStore"
import { AUTH_USER_MUT } from "hooks/login"
import { navigate } from "libs/navigator"
import { VerifyPhone } from "./index"
import { VerifyPhoneScreen } from "./VerifyPhone"

let confirm: any = jest.fn(() => Promise.resolve())
// @ts-ignore
smsConfirmationObj.mockImplementation(() => ({
    phoneNumber: "+234913498619",
    confirmation: {
        confirm,
    },
}))

// @ts-ignore
navigate.mockImplementation()

// auto mocks
jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")
jest.mock("store/authStore")
jest.mock("libs/navigator")

describe("Verify phone page tests", () => {
    describe("Verify phone integration tests", () => {
        beforeEach(() => {
            // @ts-ignore
            AsyncStorage.setItem.mockClear()
        })

        test("registration success case", async () => {
            const mock = {
                request: {
                    query: AUTH_USER_MUT,
                    variables: {
                        idToken: "id-token",
                    },
                },
                result: {
                    data: {
                        authenticateUser: {
                            success: true,
                            responseMessage: null,
                            isNewAccount: true,
                            token: "token",
                            user: {
                                id: "user_id",
                            },
                        },
                    },
                },
            }

            const queries = render(
                <MockedProvider mocks={[mock]} addTypename={false}>
                    <VerifyPhone />
                </MockedProvider>,
            )

            expect(smsConfirmationObj).toHaveBeenCalled()

            fireEvent.changeText(queries.getByTestId("codeInput"), "202020")
            fireEvent.press(queries.getByText("Continue"))

            await waitFor(() => {
                expect(navigate).toBeCalledWith("SetPin")
            })

            expect(confirm).toHaveBeenCalledWith("202020")
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(AUTH_TOKEN, "token")
            expect(ToastAndroid.show).not.toHaveBeenCalled()
        })

        test("registration error case", async () => {
            const mock = {
                request: {
                    query: AUTH_USER_MUT,
                    variables: {
                        idToken: "id-token",
                    },
                },
                result: {
                    data: {
                        authenticateUser: {
                            success: false,
                            responseMessage: "Error authenticating account",
                            isNewAccount: true,
                            token: "token",
                            user: {
                                id: "user_id",
                            },
                        },
                    },
                },
            }

            const queries = render(
                <MockedProvider mocks={[mock]} addTypename={false}>
                    <VerifyPhone />
                </MockedProvider>,
            )

            expect(smsConfirmationObj).toHaveBeenCalled()

            fireEvent.changeText(queries.getByTestId("codeInput"), "202020")
            fireEvent.press(queries.getByText("Continue"))

            await waitFor(() => {
                expect(ToastAndroid.show).toBeCalledWith("Error authenticating account", 0)
            })

            expect(confirm).toHaveBeenCalledWith("202020")
            expect(AsyncStorage.setItem).not.toHaveBeenCalled()
        })
    })

    test("view component", () => {
        const onVerify = jest.fn()
        const setCode = jest.fn()

        const queries = render(
            <VerifyPhoneScreen
                code=""
                setCode={setCode}
                phoneNumber="+234913498619"
                onVerify={onVerify}
                loading={false}
            />,
        )

        expect(queries.getByText("Sent code to \n+234913498619")).toBeTruthy()
        expect(queries.getByTestId("codeInput")).toBeTruthy()
        expect(queries.getByText(/Send again/)).toBeTruthy()
        expect(queries.getByText("Continue")).toBeTruthy()

        fireEvent.changeText(queries.getByTestId("codeInput"), "202020")
        expect(setCode).toHaveBeenCalledWith("202020")

        queries.update(
            <VerifyPhoneScreen
                code="202020"
                setCode={setCode}
                phoneNumber="+234913498619"
                onVerify={onVerify}
                loading={false}
            />,
        )

        fireEvent.press(queries.getByText("Continue"))
        expect(onVerify).toHaveBeenCalled()
    })
})
