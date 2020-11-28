const buildShortLink = jest.fn(() => Promise.resolve("https://invite.usebeam.app/ashortlink"))

const dynamicLinks = jest.fn(() => ({
    buildShortLink,
}))

// @ts-ignore
dynamicLinks.ShortLinkType = {
    UNGUESSABLE: "UNGUESSABLE",
}

export default dynamicLinks
