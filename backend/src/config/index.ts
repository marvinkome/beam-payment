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
    serviceAccount:
        process.env.NODE_ENV === "production"
            ? require("/opt/firebase/firebase_secret.json")
            : require("../../firebase_secret.json"),

    // flutterwave
    flutterwavePublicKey: process.env.FLUTTERWAVE_KEY || "",
    flutterwaveSecretKey: process.env.FLUTTERWAVE_SECRET_KEY || "",
    flutterwaveSecretHash: process.env.FLUTTERWAVE_SECRET_HASH || "",

    // africastalking
    africasTalkingAPIKey: process.env.AFRICASTALKING_API_KEY || "",
    africasTalkingUsername: process.env.AFRICASTALKING_USERNAME || "",
    africasTalkingSender: process.env.AFRICASTALKING_SENDERID || null,

    // transaction fees
    transactionFees: {
        depositFee: 0.02,
        withdrawFee: [11, 27, 54],
        smsFee: 5,
    },

    // logs
    logs: {
        level: process.env.LOG_LEVEL || "silly",
    },
}
