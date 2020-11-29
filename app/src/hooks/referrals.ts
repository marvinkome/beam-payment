import dynamicLinks, { FirebaseDynamicLinksTypes } from "@react-native-firebase/dynamic-links"
import { useEffect, useState } from "react"

export function useReferral() {
    const [phoneNumber, setPhoneNumber] = useState("")

    const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink | null) => {
        if (!/https:\/\/usebeam.app\/\?referedBy/.test(link?.url || "")) return

        // get phone number
        setPhoneNumber((link?.url || "").split("=").reverse()[0])
    }

    useEffect(() => {
        dynamicLinks()
            .getInitialLink()
            .then((link) => handleDynamicLink(link))

        const unsubscribe = dynamicLinks().onLink(handleDynamicLink)
        return () => unsubscribe()
    }, [])

    return phoneNumber
}
