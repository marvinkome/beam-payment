import { ToastAndroid } from "react-native"

ToastAndroid.SHORT = 0
ToastAndroid.show = jest.fn()

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")
