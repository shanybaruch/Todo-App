const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM
const { useSelector, } = ReactRedux
import { ActivityList } from '../cmps/ActivityList.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { utilService } from '../services/util.service.js'
import { updateUser } from '../store/actions/user.actions.js'

export function UserDetails() {
    const loggedinUser = useSelector(storeState => storeState.loggedinUser)
    // console.log('loggedinUser:', loggedinUser)
    const [userDetailsToEdit, setUserDetailsToEdit] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedinUser) {
            setUserDetailsToEdit({
                fullname: loggedinUser.fullname || '',
                color: loggedinUser.pref.color || '#eeeeee',
                bgColor: loggedinUser.pref.bgColor || '#191919',
                activities: loggedinUser.activities || []
            })
        } else navigate('/')
    }, [loggedinUser])



    function getActivityTime(activity) {
        const { at } = activity
        return utilService.getFormattedTime(at)
    }

    function onEditUser(ev) {
        ev.preventDefault()
        const userToUpdate = {
            fullname: userDetailsToEdit.fullname,
            pref: { color: userDetailsToEdit.color, bgColor: userDetailsToEdit.bgColor }
        }
        updateUser(userToUpdate)
            .then(() => {
                showSuccessMsg('User updated successfully!')
            })
            .catch(err => {
                console.error('Cannot update user:', err)
                showErrorMsg('Cannot update user')
            })
    }

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
        setUserDetailsToEdit((prevUser) => ({ ...prevUser, [field]: value }))
    }


    if (!userDetailsToEdit) return <span></span>
    const { activities } = userDetailsToEdit
    return (
        <div className='container'>
            <h1>Profile</h1>
            <form className='activities-form' onSubmit={onEditUser}>
                <label htmlFor="fullname">Name:</label>
                <input type="text" id="fullname" name="fullname" value={userDetailsToEdit.fullname} onChange={handleChange} />
                <label htmlFor="name">Color:</label>
                <input type="color" name="color" value={userDetailsToEdit.color} onChange={handleChange} />
                <label htmlFor="name">BG Color:</label>
                <input type="color" name="bgColor" value={userDetailsToEdit.bgColor} onChange={handleChange} />
                <button type="submit">save</button>
            </form>

            {activities &&
                <ActivityList
                    activities={activities}
                    getActivityTime={getActivityTime}
                />
            }
        </div>
    )
}
