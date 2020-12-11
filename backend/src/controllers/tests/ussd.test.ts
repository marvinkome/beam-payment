import { handleUSSDCode } from "controllers/ussd"
import Transaction from "models/transactions"
import User from "models/users"
import mongoose from "mongoose"

async function createDemoUser(user: any) {
    return new User({
        phoneNumber: "+2349087573383",
        ...user,
    }).save()
}

describe("ussd tests", () => {
    beforeAll(async () => {
        await mongoose.connect(
            process.env.MONGO_URL || "",
            { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
            (err) => {
                if (err) {
                    console.error(err)
                    process.exit(1)
                }
            }
        )
    })

    test("initial screen", async () => {
        await createDemoUser({ accountBalance: 1245 })

        const mockReq = {
            body: { phoneNumber: "+2349087573383", text: "" },
        }

        const mockRes = {
            send: jest.fn(),
            set: jest.fn(),
        }

        // @ts-ignore
        await handleUSSDCode(mockReq, mockRes)

        expect(mockRes.send.mock.calls[0][0]).toMatch(/CON You have 1,245 naira in your account*/)
    })

    test.skip("withdraw flow - without pin", async () => {
        await createDemoUser({ accountBalance: 1245 })

        const mockReq: any = {
            body: { phoneNumber: "+2349087573383", text: "1" },
        }

        const mockRes: any = {
            send: jest.fn(),
            set: jest.fn(),
        }

        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[0][0]).toBe("CON Choose a pin to continue:")

        // set user pin
        mockReq.body.text = "1*2020"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[1][0]).toMatch(/CON Enter your account number:/)

        // set account number
        mockReq.body.text = "1*2000*0123456789"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[2][0]).toMatch(/Access Bank/g)
        expect(mockRes.send.mock.calls[2][0]).toMatch(/More/g)

        // select more bank
        mockReq.body.text = "1*2000*0123456789*9"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[3][0]).not.toMatch(/Access Bank/g)
        expect(mockRes.send.mock.calls[3][0]).not.toMatch(/More/g)
        expect(mockRes.send.mock.calls[3][0]).toMatch(/Ecobank/g)
        expect(mockRes.send.mock.calls[3][0]).toMatch(/FCMB/g)

        // select bank
        mockReq.body.text = "1*2000*0123456789*2"
        await handleUSSDCode(mockReq, mockRes)

        // expect details were saved
        const newUser = await User.findOne({ phoneNumber: "+2349087573383" })
        expect(newUser?.pin).toBeDefined()
        expect(newUser?.bankDetails?.accountNumber).toBe("0123456789")
        expect(newUser?.bankDetails?.bankCode).toBe("058")
        expect(newUser?.bankDetails?.bankName).toBe("GTBank Plc")

        const transaction = await Transaction.findOne({ from: newUser?.id })
        expect(transaction?.amount).toBe(1245)
        expect(transaction?.fees).toBe(11)
        expect(newUser?.accountBalance).toBe(0)
    })

    test.skip("withdraw flow - with pin but without account details", async () => {
        await createDemoUser({ accountBalance: 1245, pin: "a-pin" })

        const mockReq: any = {
            body: { phoneNumber: "+2349087573383", text: "1" },
        }

        const mockRes: any = {
            send: jest.fn(),
            set: jest.fn(),
        }

        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[0][0]).toMatch(/CON Enter your account number:/)

        // set account number
        mockReq.body.text = "1*0123456789"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[1][0]).toMatch(/Access Bank/g)
        expect(mockRes.send.mock.calls[1][0]).toMatch(/More/g)

        // select more bank
        mockReq.body.text = "1*0123456789*9"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[2][0]).not.toMatch(/Access Bank/g)
        expect(mockRes.send.mock.calls[2][0]).not.toMatch(/More/g)
        expect(mockRes.send.mock.calls[2][0]).toMatch(/Ecobank/g)
        expect(mockRes.send.mock.calls[2][0]).toMatch(/FCMB/g)

        // select bank
        mockReq.body.text = "1*0123456789*9*2"
        await handleUSSDCode(mockReq, mockRes)

        // expect details were saved
        const newUser = await User.findOne({ phoneNumber: "+2349087573383" })
        expect(newUser?.pin).toBeDefined()
        expect(newUser?.bankDetails?.accountNumber).toBe("0123456789")
        expect(newUser?.bankDetails?.bankCode).toBe("068")
        expect(newUser?.bankDetails?.bankName).toBe("Standard Chartered Bank")

        const transaction = await Transaction.findOne({ from: newUser?.id })
        expect(transaction?.amount).toBe(1245)
        expect(transaction?.fees).toBe(11)
        expect(newUser?.accountBalance).toBe(0)
    })

    test.skip("withdraw flow - as a current user", async () => {
        await createDemoUser({
            accountBalance: 1245,
            pin: "2020",
            bankDetails: {
                accountNumber: "0123456789",
                bankCode: "058",
                bankName: "GTBank Plc",
            },
        })

        const mockReq: any = {
            body: { phoneNumber: "+2349087573383", text: "1" },
        }

        const mockRes: any = {
            send: jest.fn(),
            set: jest.fn(),
        }

        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[0][0]).toBe(
            "CON Enter your pin to send 1,245 naira to 0123456789 - GTBank Plc"
        )

        // incorrect pin
        mockReq.body.text = "1*2021"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[1][0]).toBe("END Incorrect pin. Try again")

        // correct pin
        mockReq.body.text = "1*2020"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[2][0]).toBe(
            "END All your money has been sent to your bank account. You'll receive a credit alert shortly."
        )
    })

    test("change account details", async () => {
        await createDemoUser({
            accountBalance: 1245,
            pin: "2020",
            bankDetails: {
                accountNumber: "0123456789",
                bankCode: "058",
                bankName: "GTBank Plc",
            },
        })

        const mockReq: any = {
            body: { phoneNumber: "+2349087573383", text: "2" },
        }

        const mockRes: any = {
            send: jest.fn(),
            set: jest.fn(),
        }

        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[0][0]).toMatch(/CON Enter your account number:/)

        // set account number
        mockReq.body.text = "2*0123456789"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[1][0]).toMatch(/Access Bank/g)
        expect(mockRes.send.mock.calls[1][0]).toMatch(/More/g)

        // select more bank
        mockReq.body.text = "2*0123456789*9"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[2][0]).not.toMatch(/Access Bank/g)
        expect(mockRes.send.mock.calls[2][0]).not.toMatch(/More/g)
        expect(mockRes.send.mock.calls[2][0]).toMatch(/Ecobank/g)
        expect(mockRes.send.mock.calls[2][0]).toMatch(/FCMB/g)

        // select bank
        mockReq.body.text = "2*0123456789*9*2"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[3][0]).toMatch("END Account details have been changed")

        // expect details were saved
        const newUser = await User.findOne({ phoneNumber: "+2349087573383" })
        expect(newUser?.bankDetails?.accountNumber).toBe("0123456789")
        expect(newUser?.bankDetails?.bankCode).toBe("068")
        expect(newUser?.bankDetails?.bankName).toBe("Standard Chartered Bank")
    })

    test("change pin", async () => {
        await createDemoUser({ accountBalance: 1245, pin: "2020" })

        const mockReq: any = {
            body: { phoneNumber: "+2349087573383", text: "3" },
        }

        const mockRes: any = {
            send: jest.fn(),
            set: jest.fn(),
        }

        // @ts-ignore
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[0][0]).toMatch("CON Enter old pin")

        mockReq.body.text = "3*2021"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[1][0]).toMatch("END Old pin is incorrect")

        mockReq.body.text = "3*2020"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[2][0]).toMatch("CON Enter new pin")

        mockReq.body.text = "3*2020*2022"
        await handleUSSDCode(mockReq, mockRes)
        expect(mockRes.send.mock.calls[3][0]).toMatch("END Saved new pin")

        const newUser = await User.findOne({ phoneNumber: "+2349087573383" })
        const changedPin = await newUser?.verify_pin("2022")
        expect(changedPin).toBeTruthy()
    })

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})
