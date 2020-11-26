import * as Sentry from "@sentry/react-native"
import analytics from "@react-native-firebase/analytics"
import mixpanelApi from "react-native-mixpanel"
import { MIXPANEL_KEY } from "./keys"

export function initAnalytics() {
    if (!!MIXPANEL_KEY) {
        mixpanelApi.sharedInstanceWithToken(MIXPANEL_KEY).then(() => {
            mixpanelApi.optInTracking()
        })
    }
}

export function setUser(userId: string, props?: any) {
    Sentry.setUser({ id: userId })
    analytics().setUserId(userId)

    if (!!MIXPANEL_KEY) {
        mixpanelApi.identify(userId)
    }

    if (props) {
        !!MIXPANEL_KEY && mixpanelApi.set(props)
        analytics().setUserProperties(props)
    }
}

export function trackPageView(page?: string) {
    analytics().logScreenView({
        screen_name: page,
        screen_class: page,
    })

    if (!!MIXPANEL_KEY) {
        mixpanelApi.trackWithProperties("Visit page", { page })
    }
}

export function trackEvent(event: string, props?: any, forMixpanel = true) {
    if (!!MIXPANEL_KEY && forMixpanel) {
        mixpanelApi.trackWithProperties(event, props)
    }

    analytics().logEvent(event.split(" ").join("_").toLowerCase(), props)
}
