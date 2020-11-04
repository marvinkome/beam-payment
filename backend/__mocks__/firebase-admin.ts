const verifyIdToken = jest.fn(() => {
    return Promise.resolve({
        phoneNumber: "+2349087573383",
        uid: "firebase-uid",
    })
})

const sendNotif = jest.fn(() => {
    return Promise.resolve()
})

const firebaseAdmin = jest.createMockFromModule<any>("firebase-admin")

firebaseAdmin.auth = jest.fn(() => {
    return { verifyIdToken }
})

firebaseAdmin.messaging = jest.fn(() => {
    return { send: sendNotif }
})

module.exports = firebaseAdmin
