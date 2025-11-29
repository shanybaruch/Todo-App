const { useEffect, useState } = React
const { useSelector } = ReactRedux
const { Link, useSearchParams } = ReactRouterDOM

import { TodoList } from "../cmps/TodoList.jsx"
import { loadTodos, removeTodo, saveTodo } from '../store/actions/todo.actions.js'
import { updateBalance } from '../store/actions/user.actions.js'
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoSort } from '../cmps/TodoSort.jsx'
import { PaginationBtns } from "../cmps/PaginationBtns.jsx"
import { todoService } from '../services/todo.service.js'

export function TodoIndex() {
    const todos = useSelector((storeState) => storeState.todos)
    const isLoading = useSelector(storeState => storeState.isLoading)
    const maxPage = useSelector((storeState) => storeState.maxPage)

    const [searchParams, setSearchParams] = useSearchParams()
    const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
    const [filterBy, setFilterBy] = useState(defaultFilter)

    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos(filterBy)
            .catch(() => {
                showErrorMsg('Could not load todos')
            })

    }, [filterBy])

    function onRemoveTodo(todoId) {
        const ans = confirm('Do you want to delete this todo?')
        if (!ans) return
        removeTodo(todoId)
            .then(() => {
                console.log('removed todo ' + todoId);
                showSuccessMsg(`Removed todo with ${todoId} id successfully`)
            })
            .catch(() => showErrorMsg('Had trouble removing the todo'))
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            .then(() => {
                showSuccessMsg(`Updated ${todoToSave.txt} successfully`)
                if (todoToSave.isDone) {
                    updateBalance(10)
                }
            })
            .catch(() => showErrorMsg('Had trouble updating the todo'))
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilterBy => ({ ...prevFilterBy, ...filterBy }))
    }

    function onChangePageIdx(diff) {
        let newPageIdx = +filterBy.pageIdx + diff
        if (newPageIdx < 0) newPageIdx = maxPage - 1
        if (newPageIdx >= maxPage) newPageIdx = 0
        onSetFilterBy({ pageIdx: newPageIdx })
    }


    const { importance, isDone, pageIdx, sort, txt } = filterBy

    return (
        <section className="todo-index">
            <TodoFilter filterBy={{ importance, isDone, txt }} onSetFilterBy={onSetFilterBy} />
            <TodoSort filterBy={{ sort }} onSetFilterBy={onSetFilterBy} />

            <Link to="/todo/edit" className="add-todo-btn btn" >Add Todo</Link>

            {isLoading
                ? <div className="loading">Loading...</div>
                : <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            }

            <PaginationBtns filterBy={{ pageIdx }} onChangePageIdx={onChangePageIdx} />
        </section>
    )
}