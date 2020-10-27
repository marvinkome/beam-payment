import config from "config"
import { Request } from "express"
import { verify } from "jsonwebtoken"
import User, { IUser } from "models/users"

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
        payload = verify(token, config.jwtSecret || "")
    } catch (e) {
        return null
    }

    return await User.findById(payload.id)
}
