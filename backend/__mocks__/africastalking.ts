const send = jest.fn(() => ({
    SMSMessageData: {
        Recipients: [
            {
                status: "Success",
            },
        ],
    },
}))

module.exports = jest.fn().mockImplementation(() => {
    return { SMS: { send } }
})
