import { gql } from "apollo-server-express"
import { createTestClient } from "apollo-server-testing"
import { authenticateUser } from "controllers/authentication"
import { constructTestServer } from "./__utils"

jest.mock("controllers/authentication")

describe("Mutation", () => {
    describe("authenticateUser", () => {
        test("success: true state", async () => {
            // @ts-ignore
            authenticateUser.mockImplementationOnce(() => ({
                success: true,
                token: "token",
                isNewAccount: true,
                user: {
                    id: "userId",
                    phoneNumber: "phoneNumber",
                },
            }))

            const server = constructTestServer()
            const { mutate } = createTestClient(server)

            const response = await mutate({
                mutation: gql`
                    mutation AuthenticateUser($idToken: String!) {
                        authenticateUser(idToken: $idToken) {
                            success
                            responseMessage
                            isNewAccount
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
            expect(response.data?.authenticateUser.token).toBe("token")
            expect(response).toMatchSnapshot()
        })

        test("success: false state", async () => {
            // @ts-ignore
            authenticateUser.mockImplementationOnce(() => ({
                success: false,
                responseMessage: "Error creating user",
            }))

            const server = constructTestServer()
            const { mutate } = createTestClient(server)

            const response = await mutate({
                mutation: gql`
                    mutation AuthenticateUser($idToken: String!) {
                        authenticateUser(idToken: $idToken) {
                            success
                            responseMessage
                            isNewAccount
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
            expect(response.data?.authenticateUser.responseMessage).toBe("Error creating user")
            expect(response.data?.authenticateUser.token).toBe(null)
            expect(response).toMatchSnapshot()
        })
    })

    describe("setPin", () => {
        test("success", async () => {
            const server = constructTestServer({
                context: () => ({
                    currentUser: { id: 0, save: jest.fn() },
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
            expect(response).toMatchSnapshot()
        })
    })
})
