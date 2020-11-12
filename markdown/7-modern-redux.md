# 모던 리덕스 with Redux Toolkit

리덕스 로직들을 올바른 방식으로 일일이 손수 작성하는 건 쉬운 일이 아니다. 많은 경우 유저들이 정확히 어떻게 작성하는게 올바른 리덕스 로직인지 확신하지 못한다. 그래서 Redux Toolkit이 만들어지게됐다.

Redux Toolkit은 Redux 로직에만 관여한다. 리액트와 함께 사용할 경우 여전히 React-Redux 패키지는 필요하다.

## `configureStore` 사용하기

리덕스 툴킷은 스토어 셋업 과정을 단순하게 만들어주는 `configureStore` API를 가지고 있다. `createStore` API를 감싸서, 자동으로 스토어를 셋업해준다.

```js
import { configureStore } from '@reduxjs/toolkit'

import todosReducer from './features/todos/todosSlice'
import filtersReducer from './features/filters/filtersSlice'

const store = configureStore({
  reducer: {
    // Define a top-level state field named `todos`, handled by `todosReducer`
    todos: todosReducer,
    filters: filtersReducer
  }
})

export default store
```

다음과 같은 기능을 한다.

- `todosReducer` 와 `filtersReducer` 를 루트 리듀서 함수로 합쳐준다
- 루트 리듀서를 사용하는 리덕스 스토어를 생성한다
- `thunk` 미들웨어를 더한다
- 일반적인 실수를 바로잡아주는 미들웨어를 더한다
- 개발자 도구 확장 프로그램을 연결한다

## Slice 작성하기

리덕스 툴킷은 `creatSlice` 라는 API를 가지고 있다. 리덕스 리듀서 로직과 액션을 간결하게 만드는 데 도움을 준다.

- `switch/case` 문을 사용하는 대신, 객체 안의 함수로 작성할 수 있다
- 불변성을 유지한 채 로직을 업데이트하는 부분을 짧게 작성할 수 있다
- 리듀서 함수를 바탕으로 액션 생성자가 자동으로 생성된다

### `createSlice` 사용하기

`createSlice` 는 3개의 메인 옵션 필드를 가지는 객체를 받는다.

- `name` : 액션 타입의 prefix로 사용될 문자열
- `initialState` : 리듀서 초기 상태
- `reducers` : 문자열을 키값으로 가지는 객체, 값들은 액션들을 핸들링하는 리듀서 함수

```js
import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoAdded(state, action) {
      // ✅ This "mutating" code is okay inside of createSlice!
      state.push(action.payload)
    },
    todoToggled(state, action) {
      const todo = state.find(todo => todo.id === action.payload)
      todo.completed = !todo.completed
    },
    todosLoading(state, action) {
      return {
        ...state,
        status: 'loading'
      }
    }
  }
})

export const { todoAdded, todoToggled, todosLoading } = todosSlice.actions

export default todosSlice.reducer
```

```js
console.log(todoToggled(42))
// {type: 'todos/todoToggled', payload: 42}
```

## Immer로 불변 업데이트하기

`createSlice` 는 Immer 라이브러리를 내부적으로 사용하고 있다. Immer는 `Proxy` 를 사용해 데이터를 감싸서, 가변적인 코드를 작성할 수 있게 해준다.

## 데이터 정규화하기

이해 중
