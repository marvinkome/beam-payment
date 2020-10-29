import config from "config"
import Logger from "loaders/logger"
import { Request } from "express"
import { verify, sign } from "jsonwebtoken"
import User, { IUser } from "models/users"

export function generateToken(user: IUser) {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60) // expires in 60 days

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
        Logger.error(e)
        return null
    }

    return await User.findById(payload.id)
}
