import React from "react"
import { AuthContext } from "libs/auth-context"
import { ToastAndroid } from "react-native"
import { MockedProvider } from "@apollo/client/testing"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { SAVE_PIN, SetPin } from "./index"
import { SetPinScreen } from "./SetPin"

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")

describe("SetPin page tests", () => {
    describe("integration tests", () => {
        test("success test", async () => {
            const mock = {
                request: {
                    query: SAVE_PIN,
                    variables: {
                        pin: "2020",
                    },
                },
                result: {
                    data: {
                        setPin: {
                            success: true,
                            responseMessage: null,
                            user: {
                                id: "user_id",
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
                        <SetPin />
                    </MockedProvider>
                </AuthContext.Provider>,
            )

            fireEvent.changeText(queries.getByTestId("codeInput"), "2020")
            fireEvent.press(queries.getByText("Continue"))

            await waitFor(() => {
                expect(signIn).toBeCalled()
            })
        })

        test("error test", async () => {
            const mock = {
                request: {
                    query: SAVE_PIN,
                    variables: {
                        pin: "2020",
                    },
                },
                result: {
                    data: {
                        setPin: {
                            success: false,
                            responseMessage: "Error saving pin. Please try again",
                            user: null,
                        },
                    },
                },
            }

            const queries = render(
                <MockedProvider mocks={[mock]} addTypename={false}>
                    <SetPin />
                </MockedProvider>,
            )

            fireEvent.changeText(queries.getByTestId("codeInput"), "2020")
            fireEvent.press(queries.getByText("Continue"))

            await waitFor(() => {
                expect(ToastAndroid.show).toBeCalledWith("Error saving pin. Please try again", 0)
            })
        })
    })

    test("view component", () => {
        const onContinue = jest.fn()
        const setPin = jest.fn()

        const queries = render(<SetPinScreen pin="" onContinue={onContinue} setPin={setPin} />)

        expect(queries.getByTestId("codeInput")).toBeTruthy()
        expect(queries.getByText("Continue")).toBeTruthy()

        fireEvent.press(queries.getByText("Continue"))
        expect(onContinue).toHaveBeenCalledTimes(0)

        fireEvent.changeText(queries.getByTestId("codeInput"), "2020")
        expect(setPin).toHaveBeenCalledWith("2020")

        queries.update(<SetPinScreen pin="2020" onContinue={onContinue} setPin={setPin} />)

        fireEvent.press(queries.getByText("Continue"))
        expect(onContinue).toHaveBeenCalled()
    })
})
