const { Link, NavLink } = ReactRouterDOM
const { useSelector } = ReactRedux

import { logout } from '../store/actions/user.actions.js'

import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from './LoginSignup.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'
import { TodosProgress } from './TodosProgress.jsx'


export function AppHeader() {

    const loggedinUser = useSelector((storeState) => storeState.loggedinUser)
    const doneTodosPercent = useSelector((storeState) => storeState.doneTodosPercent)

    function onLogout() {
        logout()
            .then(() => {
                console.log('bye');
            })
            .catch((err) => {
                showErrorMsg('OOPs try again')
            })
    }

    function getStyleByUser() {
        if (!loggedinUser) return {}
        const { color, bgColor: backgroundColor } = loggedinUser.pref
        return { color, backgroundColor }
    }

    return (
        <header style={getStyleByUser()} className="app-header full main-layout">
            <section className="header-container">
                <div>
                    <h1 className='title'>React Todo App</h1>
                    {loggedinUser
                        ? (< section className="flex space-between align-center container">
                            <div className='user-head'>
                                <Link to={`/user`}>{loggedinUser.fullname}</Link>
                                <p className='p-balance'>Your balance is {loggedinUser.balance}</p>
                                <button className='btn-login' onClick={onLogout}>Logout</button>
                            </div>
                            {doneTodosPercent !== undefined &&
                                <TodosProgress doneTodosPercent={doneTodosPercent} />
                            }
                        </ section >)
                        : (<section>
                            <LoginSignup />
                        </section>)}
                </div>
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/user" >Profile</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
