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
})
