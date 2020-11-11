module.exports = {
    init: jest.fn().mockImplementation(() => ({
        track: jest.fn(),
        people: { set: jest.fn() },
    })),
}
