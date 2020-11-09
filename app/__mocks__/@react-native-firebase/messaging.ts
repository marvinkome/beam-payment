const getToken = jest.fn(() => Promise.resolve("token"))

export default jest.fn(() => ({
    getToken,
}))
