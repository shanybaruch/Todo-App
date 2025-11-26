export function ConfirmRemove({ onConfirmModal, onCancelModal, onRemoveTodo, showRemoveModal }) {
    
    // function setRemove (todoId) {
    //     showRemoveModal(false)
    //     // onCancelModal()
    //     onRemoveTodo(todoId)
    // }

    return (
        <section className="confirm-remove">
            <div className="container">
                <p>Are you sure you want to remove this todo?</p>
                    <button className="btn-yes" onClick={onConfirmModal}>Yes</button>
                    <button className="btn-no" onClick={onCancelModal}>No</button>
            </div>
        </section>
    )
}