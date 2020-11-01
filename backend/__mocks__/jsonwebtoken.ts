const jsonwebtoken = jest.createMockFromModule<any>("jsonwebtoken")

jsonwebtoken.sign = () => {
    return "token"
}

jsonwebtoken.verify = (token: string, key: string) => {
    if (!key) {
        throw new Error("config secret not set")
    }

    return { id: "user_id" }
}

module.exports = jsonwebtoken
