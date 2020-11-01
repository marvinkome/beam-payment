const verifyIdToken = jest.fn(() => {
    return Promise.resolve({
        phoneNumber: "+2349087573383",
        uid: "firebase-uid",
    })
})

const firebaseAdmin = jest.createMockFromModule<any>("firebase-admin")

firebaseAdmin.auth = jest.fn(() => {
    return { verifyIdToken }
})

module.exports = firebaseAdmin
