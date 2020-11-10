import * as ussdViews from "views/ussd"
import banks from "config/banks"
import { IUser } from "models/users"
import { formatCurrency } from "libs/helpers"
import { UserService } from "./user"

export class UssdService {
    user: IUser
    userService: UserService

    constructor(user: IUser) {
        this.user = user
        this.userService = new UserService(user)
    }

    async handleUSSDCode(code: string) {
        if (code === "") {
            return this.handleInitialScreen()
        }

        if (code === "1") {
            return this.handleWithdrawOption()
        }

        if (/1\*\d{4}$/g.test(code)) {
            return this.handleWithdrawPin(code)
        }

        if (/1\*.*\d{10}$/.test(code)) {
            return this.handleAccountNumber(code)
        }

        if (/1\*.*\d{10}\*[9]$/.test(code)) {
            return this.handleMoreBanks()
        }

        if (/1\*.*\d{10}\*[1-6]$/.test(code)) {
            return this.handleSelectBank(code)
        }

        if (/1\*.*\d{10}\*[9]\*[1-5]$/.test(code)) {
            return this.handleSelectBank(code, true)
        }
    }

    private handleInitialScreen() {
        return ussdViews.renderInitialScreen(formatCurrency(this.user.accountBalance || 0))
    }

    private handleWithdrawOption() {
        // check if user has pin
        if (!this.user.pin) {
            return ussdViews.renderChoosePin()
        }

        if (
            !this.user.bankDetails?.accountNumber ||
            !this.user.bankDetails.bankName ||
            !this.user.bankDetails.bankCode
        ) {
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

        // render bank details
        return ussdViews.renderChooseBank(banks.slice(0, 6), true)
    }

    private async handleMoreBanks() {
        return ussdViews.renderChooseBank(banks.slice(6, banks.length), false)
    }

    private async handleSelectBank(code: string, secondOption?: boolean) {
        const bankIndex = parseInt(code.match(/[1-6]$/)![0])
        const slicedBanks = secondOption ? banks.slice(6, banks.length) : banks.slice(0, 6)

        await this.userService.storeAccountDetails({
            bankCode: slicedBanks[bankIndex - 1].code,
            bankName: slicedBanks[bankIndex - 1].name,
        })

        return this.transferMoney()
    }

    private async transferMoney() {
        let response = ussdViews.renderTransferredMoney()
        try {
            await this.userService.withdrawMoney()
        } catch (err) {
            response = ussdViews.renderTransferError()
        }

        return response
    }
}
