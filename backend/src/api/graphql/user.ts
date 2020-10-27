import { gql } from "apollo-server-express"

export const userTypeDef = gql`
    type User {
        id: ID
    }
`

export const userResolver = {
    User: {},
}
