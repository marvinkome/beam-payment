import { ToastAndroid, Alert } from "react-native"

ToastAndroid.SHORT = 0
ToastAndroid.show = jest.fn()

Alert.alert = jest.fn()

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")
