import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { LOGIN_MUT } from "hooks/login"
import { USER_PUB_DETAIL } from "libs/keys"
import { MockedProvider } from "@apollo/client/testing"
import { AuthContext } from "libs/auth-context"
import { ToastAndroid } from "react-native"
import { authToken } from "store/authStore"
import { LoginScreen } from "./Login"
import { Login } from "./index"

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")
jest.mock("store/authStore")
jest.mock("libs/navigator")

describe("Login page", () => {
    describe("Login integration tests", () => {
        beforeEach(async () => {
            // @ts-ignore
            AsyncStorage.setItem.mockClear()
            await AsyncStorage.setItem(USER_PUB_DETAIL, "+234913498619")
        })

        test("login success case", async () => {
            const mock = {
                request: {
                    query: LOGIN_MUT,
                    variables: {
                        phoneNumber: "+234913498619",
                        pin: "2020",
                    },
                },
                result: {
                    data: {
                        loginUser: {
                            success: true,
                            responseMessage: null,
                            token: "token",
                            user: {
                                id: "user_id",
                                isNewAccount: false,
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
                        <Login />
                    </MockedProvider>
                </AuthContext.Provider>,
            )

            fireEvent.changeText(queries.getByTestId("codeInput"), "2020")
            fireEvent.press(queries.getByText("Continue"))

            await waitFor(() => {
                expect(signIn).toBeCalled()
            })

            expect(authToken).toHaveBeenCalledWith("token")
            expect(ToastAndroid.show).not.toHaveBeenCalled()
        })

        test("login error case", async () => {
            const mock = {
                request: {
                    query: LOGIN_MUT,
                    variables: {
                        phoneNumber: "+234913498619",
                        pin: "2020",
                    },
                },
                result: {
                    data: {
                        loginUser: {
                            success: false,
                            responseMessage: "Invalid code. Please try again.",
                            token: null,
                            user: null,
                        },
                    },
                },
            }

            const queries = render(
                <MockedProvider mocks={[mock]} addTypename={false}>
                    <Login />
                </MockedProvider>,
            )

            fireEvent.changeText(queries.getByTestId("codeInput"), "2020")
            fireEvent.press(queries.getByText("Continue"))

            await waitFor(() => {
                expect(ToastAndroid.show).toBeCalledWith("Invalid code. Please try again.", 0)
            })
        })
    })

    test("view component", () => {
        const onContinue = jest.fn()
        const setPin = jest.fn()

        const queries = render(<LoginScreen pin="" onContinue={onContinue} setPin={setPin} />)

        expect(queries.getByTestId("codeInput")).toBeTruthy()
        expect(queries.getByText("Continue")).toBeTruthy()

        fireEvent.press(queries.getByText("Continue"))
        expect(onContinue).toHaveBeenCalledTimes(0)

        fireEvent.changeText(queries.getByTestId("codeInput"), "2020")
        expect(setPin).toHaveBeenCalledWith("2020")

        queries.update(<LoginScreen pin="2020" onContinue={onContinue} setPin={setPin} />)

        fireEvent.press(queries.getByText("Continue"))
        expect(onContinue).toHaveBeenCalled()
    })
})
