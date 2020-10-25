import { ReactiveVar } from "@apollo/client"

export function createMockReactiveVar<T>(defaultValue?: T): ReactiveVar<T> {
    let currentValue: T | undefined = defaultValue

    // @ts-ignore
    return function mockReactiveVar(newValue?: T): T {
        if (newValue) {
            currentValue = newValue
        }
        return currentValue as T
    }
}
