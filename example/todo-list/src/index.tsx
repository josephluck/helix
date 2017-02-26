require('es6-shim')
import helix from '../../../src'
import { h } from '../../../src/html'

function todoList ({state, prev, actions}) {
  return (
    <section class='section hero'>
      <div class='card'>
        <form class='card-content' onSubmit={(e) => {
          e.preventDefault()
          actions.addTodo(state.newTodo)
        }}>
          Todo list
          <ul>
            {state.todos.map((todo, index) => {
              return (
                <li>
                  {todo}
                  <a onclick={() => actions.removeTodo(index)}>
                    Delete
                  </a>
                </li>
              )
            })}
          </ul>
          <input value={state.newTodo} onInput={(e) => actions.setNewTodoText(e.target.value)} />
          <button type='submit'>
            Add todo
          </button>
        </form>
      </div>
    </section>
  )
}

const app = helix({
  model: {
    state: {
      todos: [],
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
  },
  component: todoList,
})

const node = document.createElement('div')
document.body.appendChild(node)
app(node)
