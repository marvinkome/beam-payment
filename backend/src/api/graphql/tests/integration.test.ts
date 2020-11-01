import mongoose from "mongoose"
import User from "models/users"
import { auth } from "firebase-admin"
import { gql } from "apollo-server-express"
import { createTestClient } from "apollo-server-testing"
import { constructTestServer } from "./__utils"

beforeAll(async () => {
    await mongoose.connect(
        process.env.MONGO_URL || "",
        { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
        (err) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
        }
    )
})

describe("Mutation", () => {
    describe("authenticateUser", () => {
        test("success: true state", async () => {
            const server = constructTestServer()
            const { mutate } = createTestClient(server)

            const response = await mutate({
                mutation: gql`
                    mutation AuthenticateUser($idToken: String!) {
                        authenticateUser(idToken: $idToken) {
                            success
                            responseMessage
                            token
                            user {
                                id
                                isNewAccount
                                accountSetupState
                            }
                        }
                    }
                `,
                variables: { idToken: "id-token" },
            })

            expect(response.errors).toBeUndefined()
            expect(response.data?.authenticateUser.token).toBe("token")
            expect(response.data?.authenticateUser.user.isNewAccount).toBe(true)
            expect(response.data?.authenticateUser.user.accountSetupState).toBe("SET_PIN")
        })

        test("success: false state", async () => {
            // @ts-ignore
            auth.mockImplementationOnce(() => ({
                verifyIdToken: jest.fn(() => Promise.reject({})),
            }))

            const server = constructTestServer()
            const { mutate } = createTestClient(server)

            const response = await mutate({
                mutation: gql`
                    mutation AuthenticateUser($idToken: String!) {
                        authenticateUser(idToken: $idToken) {
                            success
                            responseMessage
                            token
                            user {
                                id
                            }
                        }
                    }
                `,
                variables: { idToken: "id-token" },
            })

            expect(response.errors).toBeUndefined()
            expect(response.data?.authenticateUser.responseMessage).toBe("Error creating account")
            expect(response.data?.authenticateUser.token).toBe(null)
            expect(response.data?.authenticateUser.user).toBe(null)
        })
    })

    describe("setPin", () => {
        test("success", async () => {
            const server = constructTestServer({
                context: () => ({
                    currentUser: new User({ phoneNumber: "+2349087573383" }),
                }),
            })

            const { mutate } = createTestClient(server)

            const response = await mutate({
                mutation: gql`
                    mutation SetPin($pin: String!) {
                        setPin(pin: $pin) {
                            success
                            responseMessage
                            user {
                                id
                            }
                        }
                    }
                `,
                variables: { pin: "1234" },
            })

            expect(response.errors).toBeUndefined()
            expect(response.data?.setPin.success).toBeTruthy()
            expect(response.data?.setPin.responseMessage).toBe(null)
            expect(response.data?.setPin.user).toBeTruthy()
        })
    })

    describe("addMoney", () => {
        test("success", async () => {
            const server = constructTestServer({
                context: () => ({
                    currentUser: new User({ phoneNumber: "+2349087573383" }),
                }),
            })

            const { mutate } = createTestClient(server)

            const response = await mutate({
                mutation: gql`
                    mutation AddMoney($addMoneyInput: AddMoneyInput) {
                        addMoney(data: $addMoneyInput) {
                            success
                            responseMessage
                            user {
                                id
                                accountBalance
                            }
                        }
                    }
                `,
                variables: {
                    addMoneyInput: {
                        tx_id: "123456",
                        tx_ref: "a-ref-1234",
                        amount: 500,
                    },
                },
            })

            expect(response.errors).toBeUndefined()
            expect(response.data?.addMoney.success).toBeTruthy()
            expect(response.data?.addMoney.responseMessage).toBe(null)
            expect(response.data?.addMoney.user.accountBalance).toBe(500)
        })
    })
})

describe("Query", () => {
    describe("me", async () => {
        const server = constructTestServer({
            context: () => ({
                currentUser: new User({ phoneNumber: "+2349087573383" }),
            }),
        })

        const { query } = createTestClient(server)

        const response = await query({
            query: gql`
                query Me() {
                    me {
                        isNewAccount
                        accountBalance
                        accountSetupState
                    }
                }
            `,
        })

        expect(response.errors).toBeUndefined()
        expect(response.data?.me.isNewAccount).toBeTruthy()
        expect(response.data?.me.accountBalance).toBe(null)
        expect(response.data?.me.accountSetupState).toBe("SET_PIN")
    })
})

afterAll(async () => {
    await mongoose.disconnect()
})
