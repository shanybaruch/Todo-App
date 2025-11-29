import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { PaginationBtns } from "../cmps/PaginationBtns.jsx"
import { TodoSort } from "../cmps/TodoSort.jsx"
import { loadTodos, removeTodo, saveTodo } from '../store/actions/todo.actions.js'

const { useState, useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const { useSelector } = ReactRedux

export function TodoIndex() {

    const todos = useSelector((state) => state.todos)
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
                // setTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoId))
                showSuccessMsg(`Todo removed`)
            })
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot remove todo ' + todoId)
            })
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        todoService.saveTodo(todoToSave)
            .then((savedTodo) => {
                showSuccessMsg(`Todo is ${(savedTodo.isDone) ? 'done' : 'back on your list'}`)
                if (todoToSave.isDone) {
                    updateBalance(10)
                }
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todoId)
            })
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


    if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">

            <TodoFilter filterBy={{ importance, isDone, txt }} onSetFilterBy={onSetFilterBy} />
            
            <TodoSort filterBy={{ sort }} onSetFilterBy={onSetFilterBy} />

            <div>
                <Link to="/todo/edit" className="btn btn-add">Add Todo</Link>
            </div>

            <h2>Todos List</h2>

            {isLoading
                ? <div className="loading">Loading...</div>
                : <TodoList todos={todos} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
            }

            <PaginationBtns filterBy={{ pageIdx }} onChangePageIdx={onChangePageIdx} />

        </section>
    )
}