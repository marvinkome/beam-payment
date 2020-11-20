const signInWithPhoneNumber = jest.fn(() => Promise.resolve({}))
const getIdToken = jest.fn(() => Promise.resolve("id-token"))
const onAuthStateChanged = jest.fn(() => jest.fn())

export default jest.fn(() => ({
    signInWithPhoneNumber,
    onAuthStateChanged,
    currentUser: {
        getIdToken,
    },
}))
