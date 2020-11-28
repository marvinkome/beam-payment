import { Alert, ToastAndroid } from "react-native"

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")

// @ts-ignore
jest.mock("@sentry/react-native")

// @ts-ignore
Alert.alert = jest.fn()
ToastAndroid.show = jest.fn()
ToastAndroid.SHORT = 0

jest.mock("react-native/Libraries/Vibration/Vibration.js", () => {
    return {
        vibrate: jest.fn(),
    }
})
