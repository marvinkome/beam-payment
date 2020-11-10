import { Alert } from "react-native"
import * as Sentry from "@sentry/react-native"

Alert.alert = jest.fn()

jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper")

// @ts-ignore
// global.Sentry = Sentry
jest.mock("@sentry/react-native")
