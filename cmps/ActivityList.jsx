
export function ActivityList({ activities, getActivityTime }) {
    return (
        <ul className='activities-list clean-list'>
            {activities.map((activity, idx) => (
                <li key={activity.at}>
                    {getActivityTime(activity)}
                    {activity.txt}
                </li>
            ))}
        </ul>
    )
}