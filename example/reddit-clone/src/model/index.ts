export default function model () {
  return {
    state: {
      todos: [
        'Learn Helix',
        'Profit',
      ],
      newTodo: '',
    },
    reducers: {
      addTodo (state, todo) {
        return todo
          ? {
            ...state,
            newTodo: '',
            todos: state.todos.concat(todo),
          }
          : state
      },
      removeTodo (state, index) {
        return {
          ...state,
          todos: state.todos.filter((todo, i) => i !== index),
        }
      },
      setNewTodoText (state, newTodo) {
        return {
          ...state,
          newTodo,
        }
      },
    },
  }
}
