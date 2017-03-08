require('es6-shim')
import helix from '../../../src'
import html from '../../../src/html'

function todoList (state, prev, actions) {
  return html`
    <section class='section hero'>
      <div class='card'>
        <div class='card-content'>
          <div class='title is-3'>
            Stuff I need to get done
          </div>

          <hr />

          <form
            class='control has-addons'
            onsubmit=${(e) => {
              e.preventDefault()
              actions.addTodo(state.newTodo)
            }}
          >
            <input
              class='input is-expanded'
              value=${state.newTodo}
              oninput=${(e) => actions.setNewTodoText(e.target.value)}
            />
            <button
              class='button'
              type='submit'
            >
              Add todo
            </button>
          </form>

          <hr />

          <div class='block control is-grouped'>
            ${state.todos.map((todo, index) => {
              return html`
                <span class='control tag is-large is-success'>
                  ${todo}
                  <a class='delete' onclick=${() => actions.removeTodo(index)}></a>
                </span>
              `
            })}
          </div>
        </div>
      </div>
    </section>
  `
}

const app = helix({
  model: {
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
            newTodo: '',
            todos: state.todos.concat(todo),
          }
          : state
      },
      removeTodo (state, index) {
        return {
          todos: state.todos.filter((todo, i) => i !== index),
        }
      },
      setNewTodoText (state, newTodo) {
        return {
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
