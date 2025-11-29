import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React


export function TodoSort({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const debouncedSetFilterRef = useRef(utilService.debounce(onSetFilterBy, 500))


    useEffect(() => {
        debouncedSetFilterRef.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value
        console.log('field:', field)

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default: break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value, pageIdx: 0 }))
    }


    return (
        <div className="sort-container">
            <select value={filterByToEdit.sort} name="sort" onChange={handleChange} id="sort">
                <option value="">Sort By</option>
                <option value="txt">Text</option>
                <option value="createdAt">Time</option>
            </select>
        </div>
    )
}
