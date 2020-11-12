import { client } from '../../api/client'

const initialState = []

export const todosLoaded = (todos) => ({
  type: 'todos/todosLoaded',
  payload: todos,
})

export const todosAdded = (todo) => ({
  type: 'todos/todoAdded',
  payload: todo,
})

export default function todosReducer(state = initialState, action) {
  switch (action.type) {
    case 'todos/todosLoaded': {
      return action.payload
    }
    case 'todos/todoAdded': {
      // Can return just the new todos array - no extra object around it
      return [...state, action.payload]
    }
    case 'todos/todoToggled': {
      return state.map((todo) => {
        if (todo.id !== action.payload) {
          return todo
        }

        return {
          ...todo,
          completed: !todo.completed,
        }
      })
    }
    case 'todos/colorSelected': {
      const { color, todoId } = action.payload
      return state.map((todo) => {
        if (todo.id !== todoId) {
          return todo
        }

        return {
          ...todo,
          color,
        }
      })
    }
    case 'todos/todoDeleted': {
      return state.filter((todo) => todo.id !== action.payload)
    }
    case 'todos/allCompleted': {
      return state.map((todo) => {
        return { ...todo, completed: true }
      })
    }
    case 'todos/completedCleared': {
      return state.filter((todo) => !todo.completed)
    }
    default:
      return state
  }
}

export const fetchTodos = () => async (dispatch, getState) => {
  const response = await client.get('/fakeApi/todos')

  const stateBefore = getState()
  console.log('Todos before dispatch: ', stateBefore.todos.length)

  dispatch(todosLoaded(response.todos))

  const stateAfter = getState()
  console.log('Todos after dispatch: ', stateAfter.todos.length)
}

export function saveNewTodo(text) {
  return async function saveNewTodoThunk(dispatch, getState) {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    dispatch(todosAdded(response.todos))
  }
}
