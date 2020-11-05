# Redux 기초

[리덕스 공식 사이트 예제](https://redux.js.org/tutorials/fundamentals/part-1-overview)를 따라 만들어보며 우리말로 정리해보자.

## 데이터 흐름

**데이터는 한 방향으로 흐른다.**

1. `action` 은 마우스 클릭같은 유저 인터랙션에 의해 `dispatch` 된다.
2. `store` 는 `reducer` 함수를 실행하고, 새로운 `state` 를 계산한다.
3. UI 는 새로운 `state` 를 읽고, 새로운 값을 화면에 뿌린다.

![리덕스 데이터 흐름](https://redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)

더 단순하게 표현하자면 아래와 같은 그림이다.

- State는 앱의 특정 시간의 상태(스냅샷)라고 말할 수 있다.
- UI(View)는 state 바탕으로 렌더링 된다.
- 어떤 행위가 일어나면, 그 행위를 바탕으로 state가 업데이트된다.
- UI는 새로운 state를 바탕으로 재렌더링 된다.

![한방향 데이터 흐름](https://redux.js.org/assets/images/one-way-data-flow-04fe46332c1ccb3497ecb04b94e55b97.png)

## 불변성

"가변성"은 "변화 가능함"을 의미한다. 뭔가가 "불변"한다면, 그건 절대로 변하지 않는다는 뜻이다.

자바스크립트의 객체와 배열은 기본적으로 가변적이다.

```js
const obj = { a: 1, b: 2 }
// 값을 변경할 수 있다.
obj.b = 3

const arr = ['a', 'b']
// 값을 변경할 수 있다.
arr.push('c')
arr[1] = 'd'
```

**값을 불변성을 유지한 채 업데이트하려면, 객체/배열을 복사한 후 그 값을 변경하고, 그 값을 적용해야 한다.**

```js
const obj2 = {
  ...obj,
  b: 3
}
```

## Redux 전문 용어

### Actions (액션)

액션은 `type` 값을 가진 자바스크립트 객체다. 애**플리케이션에서 일어나는 이벤트라고 생각해도 된다.** `type` 필드는 보통 `"domain/eventName"` 식으로 작성된다. (`"todos/todoAdded"`)

액션은 `payload` 라는 값을 추가로 가질 수 있다. 이 값엔 어떤 일이 일어났을 때, 그에 관한 추가적인 정보가 들어간다.

```js
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Buy milk'
}
```

### Reducers (리듀서)

리듀서 함수는 현재 상태와 액션 객체를 매개변수로 받는 함수다. 어떻게 상태가 업데이트돼야 할지를 정의하고, 새로운 상태를 반환한다. `(state, action) => newState`. **리듀서를 액션 type에 따라 이벤트를 핸들링하는 이벤트 리스너라고 생각해도 된다.**

리듀서 함수는 *지켜야만 하는* 몇가지 규칙이 있다.

- 데이터의 단방향 흐름 : 새로운 상태는 `state`, `action` 을 통해서만 결정된다.
- 불변성 : `state` 를 변경시켜선 안된다. - 항상 복사본을 통해서만 변경해라.
- AJAX call이나 비동기 로직같은 "side-effect"가 있어선 안된다.

```js
const initialState = { value: 0 }

function counterReducer(state = initialState, action) {
  // Check to see if the reducer cares about this action
  if (action.type === 'counter/incremented') {
    // If so, make a copy of `state`
    return {
      ...state,
      // and update the copy with the new value
      value: state.value + 1
    }
  }
  // otherwise return the existing state unchanged
  return state
}
```

#### 👉 'Reducer'라 불리는 이유

`Array.reduce` 메서드는 배열을 순회하며, 배열의 아이템 하나마다 어떠한 프로세스를 거쳐 하나의 값으로 만들어준다. "배열을 하나의 값으로 줄인다(reduce)"라고 생각할 수 있다.

`Array.reduce` 는 콜백 함수를 매개변수로 받는데, 이 함수가 배열의 아이템마다 불려진다. 이 함수는 2개의 매개변수를 받는다.

- `previousResult`(이전 상태), 직전 콜백 함수가 반환한 값
- `currentItem`(현재 값), 배열의 현재 아이템

처음 콜백함수가 실행되면 "이전 상태"가 없으므로, 추가적으로 첫번째 "이전 상태"로 사용될  초기값을 넘겨줄 수 있다.

```js
const numbers = [2, 5, 8]

const addNumbers = (previousResult, currentItem) => {
  console.log({ previousResult, currentItem })
  return previousResult + currentItem
}

const initialValue = 0

const total = numbers.reduce(addNumbers, initialValue)
// {previousResult: 0, currentItem: 2}
// {previousResult: 2, currentItem: 5}
// {previousResult: 7, currentItem: 8}

console.log(total)
// 15
```

**리듀서 함수도 위 `addNumbers` 콜백 함수와 같다.** 이전 상태(`state`)와 현재 값(`action` 객체)를 통해 새로운 상태를 반환한다.

```js
const actions = [
  { type: 'counter/incremented' },
  { type: 'counter/incremented' },
  { type: 'counter/incremented' }
]

const initialState = { value: 0 }

const finalResult = actions.reduce(counterReducer, initialState)
console.log(finalResult)
// {value: 3}
```

**리듀서는 "일련의 액션들을 하나의 상태로 줄인다(reduce)"** 고 말할 수 있다. 차이점은 `Array.reduce()` 메서드는 한 번에, 리덕스에선 앱의 라이프타임 내내 발생한다는 점이다.

### Store (스토어)

리덕스 애플리케이션은 `store` 라고 불리는 객체 안에서 실행된다. 스토어는 리듀서를 넘겨줘서 생성할 수 있고, `getState` 메서드를 통해 현재 상태값을 가져올 수 있다.

```js
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}
```

### Dispatch (디스패치)

리덕스 스토어는 `dispatch` 라 불리는 메서드를 가지고 있다. **상태를 업데이트하는 유일한 방법은 `stroe.dispatch()` 함수에 액션 객체를 넘겨주는 방법뿐이다. 액션을 디스패치하는걸 "이벤트 발생"이라고 생각할 수 있다.**

```js
store.dispatch({ type: 'counter/incremented' })

console.log(store.getState())
// {value: 1}
```

### Selector (셀렉터)

셀렉터는 스토어 상태값에서 특정 정보를 추출할 수 있는 함수다. 애플리케이션이 비대해지면, 같은 데이터를 불러오는 곳에서 셀렉터를 사용해 반복되는 로직을 제거할 수 있다.

```js
const selectCounterValue = state => state.value

const currentValue = selectCounterValue(store.getState())
console.log(currentValue)
// 2
```
