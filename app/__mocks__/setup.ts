import { Alert } from "react-native"

Alert.alert = jest.fn()

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")
