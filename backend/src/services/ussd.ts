import * as ussdViews from "views/ussd"
import * as Sentry from "@sentry/node"
import banks from "config/banks"
import { IUser } from "models/users"
import { formatCurrency } from "libs/helpers"
import { UserService } from "./user"
import Logger from "loaders/logger"
import mixpanel from "libs/mixpanel"

export class UssdService {
    user: IUser
    userService: UserService

    constructor(user: IUser) {
        this.user = user
        this.userService = new UserService(user)
        mixpanel.people.set(user.id, {
            phone: user.phoneNumber,
        })
    }

    async handleUSSDCode(code: string) {
        if (code === "") {
            return this.handleInitialScreen()
        }

        if (code === "1") {
            return this.handleWithdrawOption()
        }

        if (code === "2") {
            return ussdViews.renderEnterAccountNumber()
        }

        if (code === "3") {
            return ussdViews.renderEnterOld()
        }

        if (/1\*\d{4}$/g.test(code)) {
            return this.handleWithdrawPin(code)
        }

        if (/[1-2]\*.*\d{10}$/.test(code)) {
            return this.handleAccountNumber(code)
        }

        if (/[1-2]\*.*\d{10}\*[9]$/.test(code)) {
            return this.handleMoreBanks()
        }

        if (/[1-2]\*.*\d{10}\*[1-6]$/.test(code)) {
            return this.handleSelectBank(code)
        }

        if (/[1-2]\*.*\d{10}\*[9]\*[1-5]$/.test(code)) {
            return this.handleSelectBank(code, true)
        }

        if (/3\*\d{4}$/.test(code)) {
            return this.handleOldPin(code)
        }

        if (/3\*\d{4}\*\d{4}$/.test(code)) {
            return this.handleNewPin(code)
        }
    }

    private handleInitialScreen() {
        mixpanel.track("Open USSD home screen", {
            category: "USSD",
        })
        return ussdViews.renderInitialScreen(formatCurrency(this.user.accountBalance || 0))
    }

    private handleWithdrawOption() {
        mixpanel.track("Use the withdrawal option", { category: "USSD" })

        // check if user has pin
        if (!this.user.pin) {
            mixpanel.track("Set pin during withdraw", { category: "USSD" })
            return ussdViews.renderChoosePin()
        }

        if (
            !this.user.bankDetails?.accountNumber ||
            !this.user.bankDetails.bankName ||
            !this.user.bankDetails.bankCode
        ) {
            mixpanel.track("Set account details during withdraw", { category: "USSD" })
            return ussdViews.renderEnterAccountNumber()
        }

        return ussdViews.renderPinToSend(
            formatCurrency(this.user.accountBalance || 0),
            this.user.bankDetails?.accountNumber || "",
            this.user.bankDetails?.bankName || ""
        )
    }

    private async handleWithdrawPin(code: string) {
        const pin = code.match(/\d{4}/)![0]

        // if creating new account
        if (!this.user.pin) {
            await this.userService.setPin(pin)

            // render bank details
            return ussdViews.renderEnterAccountNumber()
        }

        // we confirm your withdrawal with your pin
        if (!(await this.user.verify_pin(pin))) {
            return ussdViews.renderIncorrectPin()
        }

        return this.transferMoney()
    }

    private async handleAccountNumber(code: string) {
        const accountNumber = code.match(/\d{10}/)![0]
        await this.userService.storeAccountDetails({ accNumber: accountNumber })

        mixpanel.track("Saved account number", { category: "USSD" })
        // render bank details
        return ussdViews.renderChooseBank(banks.slice(0, 6), true)
    }

    private async handleMoreBanks() {
        return ussdViews.renderChooseBank(banks.slice(6, banks.length), false)
    }

    private async handleSelectBank(code: string, secondOption?: boolean) {
        const withdrawing = code.match(/^[1-2]/)![0] === "1"
        const bankIndex = parseInt(code.match(/[1-6]$/)![0])
        const slicedBanks = secondOption ? banks.slice(6, banks.length) : banks.slice(0, 6)

        await this.userService.storeAccountDetails({
            bankCode: slicedBanks[bankIndex - 1].code,
            bankName: slicedBanks[bankIndex - 1].name,
        })

        mixpanel.track("Saved bank details", { category: "USSD" })
        return withdrawing ? this.transferMoney() : ussdViews.savedAccountDetails()
    }

    private async handleOldPin(code: string) {
        const pin = code.match(/\d{4}/)![0]
        let correctPin = false

        try {
            correctPin = await this.user.verify_pin(pin)
        } catch (err) {
            Sentry.captureException(err)
            Logger.error(`🔥 error: ${err.message}`)
        }

        if (!correctPin) {
            return "END Old pin is incorrect"
        }

        return "CON Enter new pin"
    }

    private async handleNewPin(code: string) {
        const pin = code.match(/\d{4}$/)![0]

        await this.userService.setPin(pin)
        return "END Saved new pin"
    }

    private async transferMoney() {
        let response = ussdViews.renderTransferredMoney()
        try {
            await this.userService.withdrawMoney()
            mixpanel.track("Withdraw money", { category: "USSD" })
        } catch (err) {
            mixpanel.track("Failed to withdraw money", { category: "USSD" })
            Sentry.captureException(err)
            response = ussdViews.renderTransferError()
        }

        return response
    }
}
