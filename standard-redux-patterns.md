# 일반적인 리덕스 패턴들

**이 패턴들이 리덕스를 사용하는 데 필수적인 게 아니다!**

## 액션 생성자

액션 생성자를 통해 액션을 반환하면 긴 액션 객체를 일일히 작성해주지 않아도 된다.

```js
const todoAdded = text => {
  return {
    type: 'todos/todoAdded',
    payload: text
  }
}
```

### 액션 생성자를 사용하는 이유

앱이 작다면, 액션 객체를 일일히 작성하는 건 어렵지 않다. 사실, 액션 생성자를 따로 만드는 건 더 많은 일을 하는 것이다. 액션도 만들고, 액션 생성자도 만들어야하니까.

그런데, 애플리케이션의 여러 부분에 같은 액션을 디스패치해야한다면 어떨까? 아니면 액션을 디스패치할때 추가적인 로직이 필요해졌다면 어떨까? 코드를 다 찾아다니며 복붙을 해야할 거다.

### 미들웨어를 액션 생성자로

미들웨어도 액션 생성자로 만들어줄 수 있다. 썽크를 바깥 함수로 감싸주면 된다.

다음과 같은 코드를

```js
export async function fetchTodos(dispatch, getState) {
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}

store.dispatch(fetchTodos)
```

이런식으로 표현해줄 수 있다.

```js
export const fetchTodos = () => async dispatch => {
  const response = await client.get('/fakeApi/todos')
  dispatch(todosLoaded(response.todos))
}

store.dispatch(fetchTodos())
```

위 예제처럼 매개변수가 필요하지 않은 미들웨어의 경우 함수로 감싸주고 말고의 큰 차이는 없다고 생각한다. 상태 로직의 차이는 당연히 아예 없고.

썽크도 함께 액션 생성자로 묶어줘서 일관적인 방법으로 함수를 호출해서 디스패치하는 것에 의의가 있는 거 같다(기존엔 썽크만 함수 자체를 넘겨주는 방식).

## 메모화된 셀렉터

```js
const selectTodoIds = state => state.todos.map(todo => todo.id)
```

위와 같은 코드는 매 액션마다 재렌더링이 일어난다. 새로운 배열 참조를 반환하기 때문이다.

이전엔 `shallowEqual` 함수를 `useSelector` 의 매개변수로 넘겨줘 해결했는데, 메모화된 셀렉터를 사용하는 방법도 있다.

**메모화**는 캐시의 일종이다. 값비싼 연산값을 저장하거나, 결과값을 재사용하는 등에 사용된다.

**메모화된 셀렉터 함수**는 가장 최근의 결과값을 저장한다. 같은 입력을 계속 호출할 경우, 같은 결과값을 리턴한다. 다른 입력값으로 호출할 경우엔 재계산하고 새로운 결과값을 반환한다.

`Reselect` 라이브러리를 통해 메모화된 셀렉터 함수를 생성할 수 있다.

```js
import { createSelector } from 'reselect'

// omit reducer

// omit action creators

export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  state => state.todos,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  todos => todos.map(todo => todo.id)
)
```

## Flux Standard Action

<https://github.com/redux-utilities/flux-standard-action#motivation>

## Normalized State

<https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape>
