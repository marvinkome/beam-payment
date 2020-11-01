import { gql } from "apollo-server-express"
import { authenticated } from "libs/auth"
import { IContext } from "loaders/apollo"

export const queryTypeDef = gql`
    type Query {
        # health check
        live: Boolean

        # account
        me: User
    }
`

export const queryResolver = {
    Query: {
        live: () => true,

        me: authenticated(async function (_: any, __: any, ctx: IContext) {
            return ctx.currentUser
        }),
    },
}
