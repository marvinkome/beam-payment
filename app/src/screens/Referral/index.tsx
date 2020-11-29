import dynamicLinks from "@react-native-firebase/dynamic-links"
import React, { useEffect, useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { Loader } from "components/Loader"
import { ReferralScreen } from "./Referral"

export const GET_PHONE_NUMBER = gql`
    query GET_PHONE_NUMBER {
        me {
            id
            phoneNumber
        }
    }
`

export async function buildReferralLink(number: string) {
    try {
        const link = await dynamicLinks().buildShortLink(
            {
                link: `https://usebeam.app/?referedBy=${number}`,
                domainUriPrefix: "https://invites.usebeam.app",
                android: {
                    packageName: "com.usebeam",
                },
            },
            dynamicLinks.ShortLinkType.UNGUESSABLE,
        )

        return link
    } catch (err) {
        console.log(err)
    }
}

export function Referral() {
    const [link, setLink] = useState("")
    const { data } = useQuery(GET_PHONE_NUMBER)

    useEffect(() => {
        if (data?.me?.phoneNumber) {
            buildReferralLink(data?.me?.phoneNumber).then((link) => {
                setLink(link!)
            })
        }
    }, [data?.me?.phoneNumber])

    if (!link.length) {
        return <Loader text="Generating referral link" />
    }

    return <ReferralScreen link={link} />
}
