import { Alert, Vibration } from "react-native"

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")

// @ts-ignore
jest.mock("@sentry/react-native")

// @ts-ignore
Alert.alert = jest.fn()

jest.mock("react-native/Libraries/Vibration/Vibration.js", () => {
    return {
        vibrate: jest.fn(),
    }
})
