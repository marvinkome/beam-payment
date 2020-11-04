import { queryTypeDef, queryResolver } from "./query"
import { mutationTypeDef, mutationResolver } from "./mutation"
import { userTypeDef, userResolver } from "./user"
import { transactionTypeDef, transactionResolver } from "./transaction"

export const typeDefs = [queryTypeDef, mutationTypeDef, userTypeDef, transactionTypeDef]

export const resolvers = [queryResolver, mutationResolver, userResolver, transactionResolver]
