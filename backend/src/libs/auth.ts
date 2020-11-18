import config from "config"
import * as Sentry from "@sentry/node"
import User, { IUser } from "models/users"
import { Request } from "express"
import { verify, sign } from "jsonwebtoken"
import { IContext } from "loaders/apollo"

export function generateToken(user: IUser) {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setMinutes(today.getMinutes() + 15) // expires in 15 mins

    return sign(
        {
            id: user._id,
            exp: expirationDate.getTime() / 1000,
        },
        config.jwtSecret
    )
}

export function getTokenFromHeaders(req: Request) {
    const auth = req.headers.authorization

    if (auth && auth.split(" ")[0] === "Bearer") {
        return auth?.split(" ")[1]
    }

    return null
}

export async function getUserFromToken(token: string): Promise<IUser | null> {
    let payload: any = null

    try {
        payload = verify(token, config.jwtSecret)
    } catch (e) {
        Sentry.captureException(e)
        return null
    }

    return await User.findById(payload.id)
}

export function authenticated(next: (...args: any[]) => any) {
    return (root: any, args: any, context: IContext, info: any) => {
        if (!context.currentUser) {
            throw new Error("Unauthenticated")
        }

        return next(root, args, context, info)
    }
}
