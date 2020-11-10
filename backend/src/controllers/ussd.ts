import express from "express"
import { findOrCreateUserAccount } from "services/authentication"
import { UssdService } from "services/ussd"

export async function handleUSSDCode(req: express.Request, res: express.Response) {
    const { phoneNumber, text } = req.body

    const { user } = await findOrCreateUserAccount(phoneNumber)
    const ussdService = new UssdService(user)

    res.set("Content-Type", "text/plain")
    return res.send(await ussdService.handleUSSDCode(text))
}
