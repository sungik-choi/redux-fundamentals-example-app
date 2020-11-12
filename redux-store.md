# 리덕스 스토어 간단 구현

```js
function createStore(reducer, preloadedState) {
  let state = preloadedState
  const listeners = []

  function getState() {
    return state
  }

  function subscribe(listener) {
    listeners.push(listener)
    return function unsubscribe() {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    state = reducer(state, action)
    listeners.forEach((listener) => listener())
  }

  dispatch({ type: '@@redux/INIT' })

  return { dispatch, subscribe, getState }
}
```

실제 Redux store는 이것보단 복잡하고 길지만, 대부분은 주석이나 경고 메세지, 엣지 케이스 핸들링이다.

실제 로직은 짧다.

- 스토어는 현재 상태값과 리듀서 함수를 스스로 갖고 있다
- `getState` 메서드는 현재 상태값을 반환한다
- `subscribe` 메서드는 리스너 콜백을 관리하고, 새로운 콜백을 삭제하는 함수를 반환한다
- `dispatch` 메서드는 리듀서 함수를 부르고, 상태를 저장하고, 리스너를 호출한다

`getState` 메서드는 현재 `state` 값을 리턴할 뿐이다(복사). **기본적으로 어떤 것도 너가 현재 원본 상태값을 수정하는 걸 막지 못한다. (객체 키에 직접 접근)**

```js
const state = store.getState()
// ❌ Don't do this - it mutates the current state!
state.filters.status = 'Active'
```

가장 잦은 오류는 `array.sort()` 메서드를 사용할 때 발생한다. `const sortedTodos = state.todos.sort()` 식으로 호출하더라도, 원본 state가 수정된다.
