const signInWithPhoneNumber = jest.fn(() => Promise.resolve({}))
const getIdToken = jest.fn(() => Promise.resolve("id-token"))

export default jest.fn(() => ({
    signInWithPhoneNumber,
    currentUser: {
        getIdToken,
    },
}))
