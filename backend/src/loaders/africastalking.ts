import config from "config"

export const AfricasTalking = require("africastalking")({
    apiKey: config.africasTalkingAPIKey,
    username: config.africasTalkingUsername,
})
