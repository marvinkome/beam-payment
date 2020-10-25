const verifyPhoneNumber = jest.fn(() => Promise.resolve({}))

export default jest.fn(() => ({
    verifyPhoneNumber,
}))
