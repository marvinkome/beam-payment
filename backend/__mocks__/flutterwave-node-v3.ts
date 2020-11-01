const verify = jest.fn(({ id }: any) => {
    expect(id).toBe("123456")

    const amount = 3060
    const percentageFee = parseFloat((1.4 / 100).toFixed(3))
    const app_fee = amount * percentageFee

    return Promise.resolve({
        status: "success",
        message: "Transaction fetched successfully",
        data: {
            id: "123456",
            tx_ref: "a-ref-1234",
            status: "successful",
            currency: "NGN",
            amount,
            app_fee,
            amount_settled: amount - app_fee,
        },
    })
})

module.exports = jest.fn().mockImplementation(() => {
    return { Transaction: { verify } }
})
