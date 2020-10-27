import { queryTypeDef, queryResolver } from "./query"
import { mutationTypeDef, mutationResolver } from "./mutation"
import { userTypeDef, userResolver } from "./user"

export const typeDefs = [queryTypeDef, mutationTypeDef, userTypeDef]

export const resolvers = [queryResolver, mutationResolver, userResolver]
