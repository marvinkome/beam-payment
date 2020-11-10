import express from "express"
import * as ussdViews from "views/ussd"
import banks from "config/banks"
import { formatCurrency } from "libs/helpers"
import { findOrCreateUserAccount } from "services/authentication"
import { UserService } from "services/user"

export async function handleUSSDCode(req: express.Request, res: express.Response) {
    const { phoneNumber, text } = req.body
    res.set("Content-Type", "text/plain")
    // console.log(text)

    let response = ""
    const { user } = await findOrCreateUserAccount(phoneNumber)
    const userService = new UserService(user)

    // initial screen
    if (text === "") {
        response = ussdViews.renderInitialScreen(formatCurrency(user.accountBalance || 0))
        return res.send(response)
    }

    /* ######### WITHDRAWAL ########## */
    if (text === "1") {
        // check if user has pin
        if (!user.pin) {
            response = ussdViews.renderChoosePin()
        } else if (!user.bankDetails?.accountNumber || !user.bankDetails?.bankName) {
            response = ussdViews.renderEnterAccountNumber()
        } else {
            response = ussdViews.renderPinToSend(
                formatCurrency(user.accountBalance || 0),
                user.bankDetails?.accountNumber || "",
                user.bankDetails?.bankName || ""
            )
        }

        return res.send(response)
    }

    // withdrawal
    if (/1\*[1-2]$/.test(text)) {
        return res.send(
            ussdViews.renderPinToSend(
                formatCurrency(user.accountBalance || 0),
                user.bankDetails?.accountNumber || "",
                user.bankDetails?.bankName || ""
            )
        )
    }

    // withdrawal -
    if (/1\*\d{4}$/g.test(text)) {
        const pin = text.match(/\d{4}/)![0]

        // if setting pin, then we assume you're a new user
        if (!user.pin) {
            await userService.setPin(pin)

            // render bank details
            response = ussdViews.renderEnterAccountNumber()
            return res.send(response)
        } else {
            // we confirm your withdrawal with your pin
            if (!(await user.verify_pin(pin))) {
                return res.send(ussdViews.renderIncorrectPin())
            }

            // since you're currently setting pin and under withdrawal we just initiate the transfer
            let response = ussdViews.renderTransferredMoney()

            try {
                await userService.withdrawMoney()
            } catch (err) {
                response = ussdViews.renderTransferError()
            }

            return res.send(response)
        }
    }

    // withdrawal - choose bank after entering account number
    if (/1\*.*\d{10}$/.test(text)) {
        const accountNumber = text.match(/\d{10}/)![0]
        await userService.storeAccountDetails({ accNumber: accountNumber })

        // render bank details
        response = ussdViews.renderChooseBank(banks.slice(0, 6), true)
        return res.send(response)
    }

    // withdrawal - see more banks
    if (/1\*.*\d{10}\*[9]$/.test(text)) {
        response = ussdViews.renderChooseBank(banks.slice(6, banks.length), false)
        return res.send(response)
    }

    // withdrawal - select from first set of banks
    if (/1\*.*\d{10}\*[1-6]$/.test(text)) {
        const bankIndex = text.match(/[1-6]$/)![0]
        const slicedBanks = banks.slice(0, 6)

        await userService.storeAccountDetails({
            bankCode: slicedBanks[bankIndex - 1].code,
            bankName: slicedBanks[bankIndex - 1].name,
        })

        // since you're currently setting pin and under withdrawal we just initiate the transfer
        let response = ussdViews.renderTransferredMoney()

        try {
            await userService.withdrawMoney()
        } catch (err) {
            response = ussdViews.renderTransferError()
        }

        return res.send(response)
    }

    // withdrawal - select from second set of banks
    if (/1\*.*\d{10}\*[9]\*[1-5]$/.test(text)) {
        const bankIndex = text.match(/[1-5]$/)![0]
        const slicedBanks = banks.slice(6, banks.length)

        await userService.storeAccountDetails({
            bankCode: slicedBanks[bankIndex - 1].code,
            bankName: slicedBanks[bankIndex - 1].name,
        })

        // since you're currently setting pin and under withdrawal we just initiate the transfer
        let response = ussdViews.renderTransferredMoney()

        try {
            await userService.withdrawMoney()
        } catch (err) {
            response = ussdViews.renderTransferError()
        }

        return res.send(response)
    }

    /* ######### END WITHDRAWAL ########## */
    if (text === "2") {
        // handle change bank details screen
    }

    if (text === "3") {
        // handle change pin screen
        response = ussdViews.renderChoosePin()
        return res.send(response)
    }
}
