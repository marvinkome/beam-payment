import express from "express"
import * as ussdViews from "views/ussd"
import { findOrCreateUserAccount } from "services/authentication"
import { UssdService } from "services/ussd"

export async function handleUSSDCode(req: express.Request, res: express.Response) {
    const { phoneNumber, text } = req.body

    let response = ""
    const { user } = await findOrCreateUserAccount(phoneNumber)
    const ussdService = new UssdService(user)

    res.set("Content-Type", "text/plain")
    return res.send(await ussdService.handleUSSDCode(text))

    if (text === "2") {
        // handle change bank details screen
    }

    if (text === "3") {
        // handle change pin screen
        response = ussdViews.renderChoosePin()
        return res.send(response)
    }
}
