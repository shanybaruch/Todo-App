import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function TodoFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    onSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500))

    useEffect(() => {
        onSetFilterBy.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

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

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, importance, isDone } = filterByToEdit
    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>

            <form onSubmit={onSubmitFilter}>

                <select value={isDone} className="flex justify-center align-center" name="isDone" onChange={(ev) => handleChange(ev)}>
                    <option value="all">All</option>
                    <option value="undone">Active</option>
                    <option value="done">Done</option>
                </select>

                <section>
                    <input value={txt} onChange={handleChange}
                        type="search" placeholder="By Txt" id="txt" name="txt"
                    />

                    <input value={importance} onChange={handleChange}
                        type="number" placeholder="By Importance" id="importance" name="importance"
                    />
                </section>

                <button hidden>Set Filter</button>
            </form>

        </section>
    )
}