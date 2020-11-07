import React from "react"
import { Modal } from "react-native"
import { render, fireEvent } from "@testing-library/react-native"
import { PickerHeader } from "./PickerHeader"
import { Picker } from "./index"

describe("Picker", () => {
    test("PickerHeader", () => {
        const onClose = jest.fn()
        const setSearchText = jest.fn()

        const queries = render(
            <PickerHeader
                searchPlaceholder="Search item"
                headerTitle="Select item"
                searchText=""
                onClose={onClose}
                setSearchText={setSearchText}
            />,
        )

        expect(queries.getByText("Select item")).toBeTruthy()

        expect(queries.getByA11yLabel("closeBtn")).toBeTruthy()
        fireEvent.press(queries.getByA11yLabel("closeBtn"))
        expect(onClose).toBeCalled()

        expect(queries.getByPlaceholderText("Search item")).toBeTruthy()
        fireEvent.changeText(queries.getByPlaceholderText("Search item"), "bank name")
        expect(setSearchText).toBeCalledWith("bank name")
    })

    test("it renders correctly", () => {
        const onChange = jest.fn()
        const data = Array(10)
            .fill(0)
            .map((_, index) => ({ Name: `Index ${index}`, Value: `${index}`, Id: `${index}` }))

        const queries = render(
            <Picker
                label="Test picker:"
                placeholder="Select item"
                data={data}
                value={null}
                onChange={onChange}
            />,
        )

        expect(queries.UNSAFE_getByType(Modal).props.visible).toBeFalsy()

        expect(queries.getByPlaceholderText("Select item")).toBeTruthy()
        fireEvent.press(queries.getByPlaceholderText("Select item"))

        expect(queries.UNSAFE_getByType(Modal).props.visible).toBeTruthy()
        expect(queries.getAllByText(/Index/)).toHaveLength(10)
        fireEvent.changeText(queries.getByPlaceholderText("Search..."), "Index 9")
        expect(queries.getAllByText(/Index/)).toHaveLength(1)

        fireEvent.press(queries.getByText("Index 9"))
        fireEvent.press(queries.getByA11yLabel("closeBtn"))

        expect(queries.UNSAFE_getByType(Modal).props.visible).toBeFalsy()
        expect(onChange).toBeCalledWith({ Name: `Index 9`, Value: `9`, Id: `9` })
    })
})
