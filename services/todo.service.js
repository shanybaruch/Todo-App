import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'

const TODO_KEY = 'todoDB'
const PAGE_SIZE = 4
var gFilteredTodosLength
_createTodos()

export const todoService = {
    query,
    get,
    remove,
    save,
    getEmptyTodo,
    getDefaultFilter,
    getFilterFromSearchParams,
    getImportanceStats,
    getDoneTodosPercent
}

function query(filterBy = {}) {
    return storageService.query(TODO_KEY)
        .then(todos => {

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                todos = todos.filter(todo => regExp.test(todo.txt))
            }

            if (filterBy.importance) {
                todos = todos.filter(todo => todo.importance >= filterBy.importance)
            }

            if (filterBy.isDone !== 'all') {
                todos = todos.filter((todo) => (filterBy.isDone === 'done' ? todo.isDone : !todo.isDone))
            }

            if (filterBy.sort) {
                if (filterBy.sort === 'txt') {
                    todos = todos.sort((a, b) => a.txt.localeCompare(b.txt));
                } else {
                    todos = todos.sort((a, b) => a.createdAt - b.createdAt);
                }
            }

            gFilteredTodosLength = todos.length
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE;
                todos = todos.slice(startIdx, startIdx + PAGE_SIZE)
            }
            return Promise.all([getDoneTodosPercent(), getMaxPage()])
                .then(([doneTodosPercent, maxPage]) => {
                    return { todos, maxPage, doneTodosPercent }
                })

        })
}

function get(todoId) {
    return storageService.get(TODO_KEY, todoId)
        .then(todo => {
            todo = _setNextPrevTodoId(todo)
            return todo
        })
        .catch(err => {
            console.error('Cannot get todo:', err)
            throw err
        })
}

function remove(todoId) {
    return storageService.remove(TODO_KEY, todoId)
        .then(() => {
            return Promise.all([getDoneTodosPercent(), getMaxPage()])
                .then(([doneTodosPercent, maxPage]) => {
                    return { maxPage, doneTodosPercent }
                })
        })
        .catch(err => {
            console.error('Cannot remove todo:', err)
            throw err
        })
}

function save(todo) {
    if (!userService.getLoggedinUser()) return Promise.reject('User is not logged in')
    return ((todo._id) ? _edit(todo) : _add(todo))
        .then((savedTodo) => {
            return Promise.all([getDoneTodosPercent(), getMaxPage()])
                .then(([doneTodosPercent, maxPage]) =>
                    ({ maxPage, doneTodosPercent, savedTodo })
                )
        })
}

function _add(todo) {
    todo.createdAt = todo.updatedAt = Date.now()
    todo.color = utilService.getRandomColor()
    return storageService.post(TODO_KEY, todo)
        .catch(err => {
            console.error('Cannot add todo:', err)
            throw err
        })


}

function _edit(todo) {
    todo.updatedAt = Date.now()
    return storageService.put(TODO_KEY, todo)
        .catch(err => {
            console.error('Cannot update todo:', err)
            throw err
        })
}

function getDoneTodosPercent() {
    return storageService.query(TODO_KEY)
        .then(todos => {
            const doneTodosCount = todos.reduce((acc, todo) => {
                if (todo.isDone) acc++
                return acc
            }, 0)

            return (doneTodosCount / todos.length) * 100 || 0
        })
        .catch(err => {
            console.error('Cannot get done todos percent:', err)
            throw err
        })
}

function getMaxPage() {
    if (gFilteredTodosLength) return Promise.resolve(Math.ceil(gFilteredTodosLength / PAGE_SIZE))

    return storageService.query(TODO_KEY)
        .then(todos => Math.ceil(todos.length / PAGE_SIZE))
        .catch(err => {
            console.error('Cannot get max page:', err)
            throw err
        })
}

function getEmptyTodo(txt = '', importance = 5) {
    return { txt, importance, isDone: false }
}

function getDefaultFilter() {
    return { txt: '', isDone: 'all', importance: 0, pageIdx: 0, sort: '' }
}

function getFilterFromSearchParams(searchParams) {
    const filterBy = {
        txt: searchParams.get('txt') || '',
        isDone: searchParams.get('isDone') || 'all',
        importance: +searchParams.get('importance') || 0,
        pageIdx: +searchParams.get('pageIdx') || 0,
        sort: searchParams.get('sort') || ''
    }

    return filterBy
}


////////////////////////////////////

function _createTodos() {
    let todos = utilService.loadFromStorage(TODO_KEY)
    if (!todos || !todos.length) {
        todos = []
        const txts = ['Learn React', 'Master CSS', 'Practice Redux']
        for (let i = 0; i < 8; i++) {
            const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]
            todos.push(_createTodo(txt + (i + 1), utilService.getRandomIntInclusive(1, 10)))
        }
        utilService.saveToStorage(TODO_KEY, todos)
    }
}

function _createTodo(txt, importance) {
    const todo = getEmptyTodo(txt, importance)
    todo._id = utilService.makeId()
    todo.createdAt = todo.updatedAt = Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24)
    todo.color = utilService.getRandomColor()
    return todo
}

function _setNextPrevTodoId(todo) {
    return storageService.query(TODO_KEY).then((todos) => {
        const todoIdx = todos.findIndex((currTodo) => currTodo._id === todo._id)
        const nextTodo = todos[todoIdx + 1] ? todos[todoIdx + 1] : todos[0]
        const prevTodo = todos[todoIdx - 1] ? todos[todoIdx - 1] : todos[todos.length - 1]
        todo.nextTodoId = nextTodo._id
        todo.prevTodoId = prevTodo._id
        return todo
    })
}

function getImportanceStats() {
    return storageService.query(TODO_KEY)
        .then(todos => {
            const todoCountByImportanceMap = _getTodoCountByImportanceMap(todos)
            const data = Object.keys(todoCountByImportanceMap).map(speedName => ({ title: speedName, value: todoCountByImportanceMap[speedName] }))
            return data
        })

}

function _getTodoCountByImportanceMap(todos) {
    const todoCountByImportanceMap = todos.reduce((map, todo) => {
        if (todo.importance < 3) map.low++
        else if (todo.importance < 7) map.normal++
        else map.urgent++
        return map
    }, { low: 0, normal: 0, urgent: 0 })
    return todoCountByImportanceMap
}


// Data Model:
// const todo = {
//     _id: "gZ6Nvy",
//     txt: "Master Redux",
//     importance: 9,
//     isDone: false,
//     createdAt: 1711472269690,
//     updatedAt: 1711472269690
// }

