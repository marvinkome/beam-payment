import mongoose from "mongoose"
import User from "models/users"
import { auth } from "firebase-admin"
import { gql } from "apollo-server-express"
import { createTestClient } from "apollo-server-testing"
import { constructTestServer } from "./__utils"

describe("Mutation", () => {
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

    describe("loginUser", () => {
        test("successful login", async () => {
            const user = new User({ phoneNumber: "+2349087573383", pin: "2020" })
            await user.save()

            const server = constructTestServer()
            const { mutate } = createTestClient(server)

            const response = await mutate({
                mutation: gql`
                    mutation LoginUser($phoneNumber: String!, $pin: String!) {
                        loginUser(phoneNumber: $phoneNumber, pin: $pin) {
                            success
                            responseMessage
                            token
                            user {
                                id
                            }
                        }
                    }
                `,
                variables: { phoneNumber: "+2349087573383", pin: "2020" },
            })

            expect(response.errors).toBeUndefined()
            expect(response.data?.loginUser.success).toBeTruthy()
            expect(response.data?.loginUser.token).toBe("token")
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

    describe("transferMoney", () => {
        test("success", async () => {
            const server = constructTestServer({
                context: () => ({
                    currentUser: new User({ phoneNumber: "+2349087573383", accountBalance: 550 }),
                }),
            })

            const { mutate } = createTestClient(server)

            const response = await mutate({
                mutation: gql`
                    mutation TransferMoney($amount: Float!, $receiverNumber: String!) {
                        transferMoney(amount: $amount, receiverNumber: $receiverNumber) {
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
                    amount: 500,
                    receiverNumber: "+2349087673383",
                },
            })

            expect(response.errors).toBeUndefined()
            expect(response.data?.transferMoney.success).toBeTruthy()
            expect(response.data?.transferMoney.responseMessage).toBe(null)
            expect(response.data?.transferMoney.user.accountBalance).toBe(45)
        })

        test("error", async () => {
            const server = constructTestServer({
                context: () => ({
                    currentUser: new User({ phoneNumber: "+2349087573384", accountBalance: 550 }),
                }),
            })

            const { mutate } = createTestClient(server)

            const response = await mutate({
                mutation: gql`
                    mutation TransferMoney($amount: Float!, $receiverNumber: String!) {
                        transferMoney(amount: $amount, receiverNumber: $receiverNumber) {
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
                    amount: 600,
                    receiverNumber: "+2349087573389",
                },
            })

            expect(response.errors).toBeUndefined()
            expect(response.data?.transferMoney.success).toBeFalsy()
            expect(response.data?.transferMoney.responseMessage).toBe("Insufficient funds")
        })
    })

    describe("saveBankDetails", () => {
        test("success", async () => {
            const server = constructTestServer({
                context: () => ({
                    currentUser: new User({ phoneNumber: "+2349087573383" }),
                }),
            })

            const { mutate } = createTestClient(server)

            const response = await mutate({
                mutation: gql`
                    mutation SaveBankDetails($data: AccountDetailsInput!) {
                        saveBankDetails(data: $data) {
                            success
                            responseMessage
                            user {
                                bankDetails {
                                    accountNumber
                                    bankName
                                }
                            }
                        }
                    }
                `,
                variables: {
                    data: { accNumber: "0123456789", bankCode: "012", bankName: "GTBank Plc" },
                },
            })

            expect(response.errors).toBeUndefined()
            expect(response.data?.saveBankDetails.success).toBeTruthy()
            expect(response.data?.saveBankDetails.responseMessage).toBe(null)
            expect(response.data?.saveBankDetails.user).toMatchObject({
                bankDetails: {
                    accountNumber: "0123456789",
                    bankName: "GTBank Plc",
                },
            })
        })
    })

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
