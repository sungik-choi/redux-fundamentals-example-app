# React와 함께 Redux 사용하기

## `useSelector` 로 상태 가져오기

`useState` 같은 리액트 훅에 익숙할 거라 생각한다. 리액트에선 별도로 커스텀 훅을 작성할 수도 있다. 커스텀 훅을 통해 재사용 가능한 로직을 따로 분리할 수 있다.

다른 많은 라이브러리와 마찬가지로, React-Redux 또한 커스텀 훅을 가지고 있다. React-Redux 훅은 리액트 컴포넌트가 리덕스 스토어로부터 상태 값을 읽거나 액션을 디스패치할 수 있게 해준다.

첫번째 훅은 `useSelector` 훅이다. 이 훅은 리액트 컴포넌트가 리액트 스토어로부터 값을 읽을 수 있게 해준다.

`useSelector` 는 단일 함수만을 허용하는데, 이 함수를 **selector** 함수라고 부른다. **셀렉터는 전체 리덕스 스토어를 매개변수로 받아서, 특정 값을 상태에서 가져와 반환한다.**

```js
const selectTodos = state => state.todos
```

```js
import React from 'react'
import { useSelector } from 'react-redux'
import TodoListItem from './TodoListItem'

const selectTodos = state => state.todos

const TodoList = () => {
  const todos = useSelector(selectTodos)

  // since `todos` is an array, we can loop over it
  const renderedListItems = todos.map(todo => {
    return <TodoListItem key={todo.id} todo={todo} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
```

처음 `<TodoList>` 컴포넌트가 렌더링되면, `useSelector` 훅은 `selectTodos` 를 호출하고, 전체 리덕스 상태 객체를 전달한다. 셀렉터가 리턴하는 건 훅을 통해 컴포넌트에 리턴된다. 컴포넌트의 `const todos` 는 리덕스 스토어 상태 `state.todos` 와 같은 값이 된다.

그런데, 만약 우리가 `{type: 'todos/todoAdded'}` 같은 액션을 디스패치하면 무슨 일이 일어날까? 리덕스 상태값이 리듀서에 의해 업데이트 될텐데, 컴포넌트가 상태값의 변화를 알아차려야, 새로운 투두 리스트를 재렌더링 할 수 있을 것이다.

이전 예제들을 통해 `store.subscribe()` 가 스토어의 변화를 감지할 수 있다는 사실을 알았다. 그러면 모든 컴포넌트에 스토어를 구독하는 코드를 작성해야 할텐데, 너무 반복적이고 핸들링하기도 어렵다.

운좋게도, **`useSelector` 는 자동으로 리덕스 스토어를 구독해준다!** 액션이 디스패치될 때마다 셀럭터 함수가 다시 호출된다. 셀렉터가 리턴한 값이 이전 값과 다르면, 컴포넌트가 재렌더링 되도록 한다.

### 주의할 점

`useSelector` 는 결과를 `===` 비교를 통해 비교한다. 실제 참조가 다르다면 컴포넌트가 재렌더링 된다. 아래와 같은 코드의 경우 상태값이 바뀌지 않더라도 매번 재랜더링된다. `array.map()` 은 언제나 새로운 배열의 참조를 리턴하기 때문이다.

```js
// Bad: always returning a new reference
const selectTodoDescriptions = state => {
  // This creates a new array reference!
  return state.todos.map(todo => todo.text)
}
```

## `useDispatch` 훅으로 액션을 디스패치하기

```js
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

const Header = () => {
  const [text, setText] = useState('')
  const dispatch = useDispatch()

  const handleChange = e => setText(e.target.value)

  const handleKeyDown = e => {
    const trimmedText = e.target.value.trim()
    // If the user pressed the Enter key:
    if (e.which === 13 && trimmedText) {
      // Dispatch the "todo added" action with this text
      dispatch({ type: 'todos/todoAdded', payload: trimmedText })
      // And clear out the text input
      setText('')
    }
  }

  return (
    <input
      type="text"
      placeholder="What needs to be done?"
      autoFocus={true}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  )
}

export default Header
```

## `Provider` 로 스토어 전달하기

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import store from './store'

ReactDOM.render(
  // Render a `<Provider>` around the entire `<App>`,
  // and pass the Redux store to as a prop
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
```

## React-Redux 패턴들

**모든 상태가 리덕스 스토어가 저장될 필요는 없다. 컴포넌트 내부 상태값은 컴포넌트에서만 관리하자.**

아래 사항들을 점검해보자.

- 이 데이터를 애플리케이션의 다른 부분에서도 사용하는가?
- 이 데이터를 기반으로 파생된 데이터를 더 만들어야 하는가?
- 동일한 데이터가 여러 컴포넌트를 실행하는데 사용되는가?
- 시간에 따른 상태값이 저장되어야 하는가? (타임 트래블링 디버깅)
- 데이터를 캐시해야하는가?
- UI 컴포넌트를 핫 리로딩하는 동안 데이터를 유지해야하는가?
  
> [타임 트래블링, 핫 리로딩 참고자료](https://bestalign.github.io/2015/10/27/redux-hot-reloading-and-time-travel-debugging/)
