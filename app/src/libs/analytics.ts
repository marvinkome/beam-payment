import * as Sentry from "@sentry/react-native"
import mixpanelApi from "react-native-mixpanel"
import { MIXPANEL_KEY } from "./keys"

export function initAnalytics() {
    if (MIXPANEL_KEY.length) {
        mixpanelApi.sharedInstanceWithToken(MIXPANEL_KEY).then(() => {
            mixpanelApi.optInTracking()
        })
    }
}

export function setUser(userId: string, props?: any) {
    Sentry.setUser({ id: userId })
    if (!MIXPANEL_KEY) return

    mixpanelApi.identify(userId)
    if (props) {
        mixpanelApi.set(props)
    }
}

export function trackEvent(event: string, props?: any, forMixpanel = true) {
    if (MIXPANEL_KEY && forMixpanel) {
        mixpanelApi.trackWithProperties(event, props)
    }
}
