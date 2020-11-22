export default jest.fn(() => ({
    setUserId: jest.fn(),
    setUserProperties: jest.fn(),
    logScreenView: jest.fn(),
    logEvent: jest.fn(),
}))
