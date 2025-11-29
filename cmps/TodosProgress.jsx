
export function TodosProgress({ doneTodosPercent }) {
    const formattedPercent = doneTodosPercent.toFixed(2) + '%'

    return (
        <section className="todos-progress">
            <h3>You have finished {formattedPercent}</h3>
            <div className="progress-bar-container" >
                <span>{formattedPercent}</span>
                <div style={{ width: formattedPercent }}>
                </div>
            </div>
        </section>
    )
}