function getConfig(dev: string, prod?: string) {
    if (__DEV__) return dev
    return prod || dev
}

export const AUTH_TOKEN = getConfig("Beam_Auth_Token_Dev", "Beam_Auth_Token_Prod")
export const USER_PUB_DETAIL = getConfig("Beam_User_Dev", "Beam_User_Prod")

// APP URLS
export const WEB_URL = getConfig("https://usebeam.chat")
export const API_URL = getConfig("http://127.0.0.1:5055", "https://api.usebeam.chat")
export const EMAIL_URL = getConfig("marvinkome@gmail.com")

// APIs
export const FLUTTERWAVE_KEY = getConfig("FLWPUBK_TEST-11ff807f10429d67f82dde205ce0b5fb-X")

export const SENTRY_KEY = getConfig(
    "https://7ffd58bcf4fa4098b4968f903c228e85@o474872.ingest.sentry.io/5511855",
)
