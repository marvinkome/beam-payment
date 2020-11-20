import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MockedProvider } from "@apollo/client/testing"
import { Alert } from "react-native"
import { AuthContext } from "libs/auth-context"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { authToken, smsConfirmationObj } from "store/authStore"
import { AUTH_USER_MUT } from "hooks/login"
import { VerifyPhone } from "./index"
import { VerifyPhoneScreen } from "./VerifyPhone"
import { USER_PUB_DETAIL } from "libs/keys"

let confirm: any = jest.fn(() => Promise.resolve())
// @ts-ignore
smsConfirmationObj.mockImplementation(() => ({
    phoneNumber: "+234913498619",
    confirmation: {
        confirm,
    },
}))

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
                            token: "token",
                            user: {
                                id: "user_id",
                                isNewAccount: true,
                                accountSetupState: "SET_PIN",
                            },
                        },
                    },
                },
            }

            const signIn = jest.fn()

            const queries = render(
                // @ts-ignore
                <AuthContext.Provider value={{ signIn }}>
                    <MockedProvider mocks={[mock]} addTypename={false}>
                        <VerifyPhone />
                    </MockedProvider>
                </AuthContext.Provider>,
            )

            expect(smsConfirmationObj).toHaveBeenCalled()

            fireEvent.press(queries.getByText("Send again"))
            await waitFor(() => {
                expect(smsConfirmationObj).toBeCalledWith({
                    confirmation: {},
                    phoneNumber: "+234913498619",
                })
            })

            fireEvent.changeText(queries.getByTestId("codeInput"), "202020")

            await waitFor(() => {
                expect(signIn).toBeCalled()
            })

            expect(authToken).toHaveBeenCalledWith("token")
            expect(AsyncStorage.setItem).toHaveBeenCalledWith(USER_PUB_DETAIL, "+234913498619")
            expect(Alert.alert).not.toHaveBeenCalled()
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
                            token: null,
                            user: null,
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

            await waitFor(() => {
                expect(Alert.alert).toBeCalledWith("Error", "Error authenticating account")
            })

            // expect(confirm).toHaveBeenCalledWith("202020")
            expect(AsyncStorage.setItem).not.toHaveBeenCalledWith(USER_PUB_DETAIL, "+234913498619")
        })
    })

    test("view component", () => {
        const onVerify = jest.fn()
        const onResendCode = jest.fn()
        const setCode = jest.fn()

        const queries = render(
            <VerifyPhoneScreen
                code=""
                setCode={setCode}
                phoneNumber="+234913498619"
                onVerify={onVerify}
                loading={false}
                resendCode={onResendCode}
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
                resendCode={onResendCode}
                loading={false}
            />,
        )

        fireEvent.press(queries.getByText("Send again"))
        expect(onResendCode).toBeCalled()

        fireEvent.press(queries.getByText("Continue"))
        expect(onVerify).toBeCalled()
    })
})
