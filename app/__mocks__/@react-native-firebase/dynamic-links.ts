const buildShortLink = jest.fn(() => Promise.resolve("https://invite.usebeam.app/ashortlink"))
const getInitialLink = jest.fn(() => Promise.resolve(null))

const dynamicLinks = jest.fn(() => ({
    buildShortLink,
    getInitialLink,
    onLink: jest.fn(() => jest.fn()),
}))

// @ts-ignore
dynamicLinks.ShortLinkType = {
    UNGUESSABLE: "UNGUESSABLE",
}

export default dynamicLinks
