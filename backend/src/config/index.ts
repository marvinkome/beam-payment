let serviceAccount = {}

if (process.env.NODE_ENV === "production") {
    serviceAccount = require("/opt/firebase/firebase_secret.json")
} else if (process.env.NODE_ENV === "development") {
    serviceAccount = require("../../firebase_secret.json")
}

export default {
    // process information
    environment: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "5055", 10),
    serverUrl: process.env.SERVER_URL || "",

    // database information
    databaseUrl: process.env.DB_URL || "",

    // encryption and session
    jwtSecret: process.env.APP_KEY || "",

    // firebase
    serviceAccount,

    // flutterwave
    flutterwavePublicKey: process.env.FLUTTERWAVE_KEY || "",
    flutterwaveSecretKey: process.env.FLUTTERWAVE_SECRET_KEY || "",
    flutterwaveSecretHash: process.env.FLUTTERWAVE_SECRET_HASH || "a-hash",

    // africastalking
    africasTalkingAPIKey: process.env.AFRICASTALKING_API_KEY || "",
    africasTalkingUsername: process.env.AFRICASTALKING_USERNAME || "",
    africasTalkingSender: process.env.AFRICASTALKING_SENDERID || null,

    // sentry
    sentryId: "https://20f8b9db7a2240ef9b12d3f0fddc5e00@o474872.ingest.sentry.io/5512341",

    // mixpanel
    mixpanel: process.env.MIXPANEL_KEY || "",

    // transaction fees
    transactionFees: {
        depositFee: 0.02,
        internationalDepositFee: 0.04,
        withdrawFee: [11, 27, 54],
        smsFee: 5,
    },

    referralFee: 100,

    // logs
    logs: {
        level: process.env.LOG_LEVEL || "silly",
    },
}
