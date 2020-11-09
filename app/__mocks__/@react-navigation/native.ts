export const DefaultTheme = {}

const navigate = jest.fn()
const goBack = jest.fn()
const addListener = jest.fn()

export const useFocusEffect = jest.fn()
export const useNavigation = jest.fn(() => ({ navigate, goBack, addListener }))
export const useRoute = jest.fn(() => ({ name: "Route Name" }))
