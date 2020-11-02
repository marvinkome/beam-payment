export const DefaultTheme = {}

const navigate = jest.fn()
const goBack = jest.fn()
export const useNavigation = jest.fn(() => ({ navigate, goBack }))

export const useRoute = jest.fn(() => ({ name: "Route Name" }))
