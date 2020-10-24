export default {
    // process information
    environment: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "5055", 10),

    // database information
    databaseUrl: process.env.DB_URL || "",

    // encryption and session
    jwtSecret: process.env.SECRET_KEY,

    // logs
    logs: {
        level: process.env.LOG_LEVEL || "silly",
    },
}
