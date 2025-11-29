export function TodoPreview({ todo, onToggleTodo }) {
//    console.log('todo preview: ', todo);
   
    return (
        <article className="todo-preview">
            <h2 className={(todo.isDone)? 'done' : 'in progress'} onClick={onToggleTodo}>
                Todo: {todo.txt}
            </h2>
            <h4>Todo Importance: {todo.importance}</h4>
            {/* <img src={`../assets/img/${'todo'}.png`} alt="" /> */}
        </article>
    )
}
