const signInWithPhoneNumber = jest.fn(() => Promise.resolve({}))

export default jest.fn(() => ({
    signInWithPhoneNumber,
}))
