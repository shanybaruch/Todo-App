import { TodosProgress } from "./TodosProgress.jsx"
const { useSelector } = ReactRedux

export function AppFooter() {
    const todos = useSelector((storeState) => storeState.todos)
    const loggedinUser = useSelector((storeState) => storeState.loggedinUser)
    const doneTodosPercent = useSelector((storeState) => storeState.doneTodosPercent)

    function getStyleByUser() {
        const prefs = {
            color: '',
            backgroundColor: ''
        }

        if (loggedinUser && loggedinUser.pref) {
            prefs.color = loggedinUser.pref.color
            prefs.backgroundColor = loggedinUser.pref.bgColor
        }

        return prefs
    }



    return (
        <footer style={getStyleByUser()} className='full'>
            {loggedinUser && todos &&
                <TodosProgress doneTodosPercent={doneTodosPercent} />}
        </footer>
    )
}
