# Redux 비동기 로직

## Redux 미들웨어와 사이드 이펙트

리덕스 스토어는 비동기 로직에 대해서 모른다. 리덕스 스토어는 아래 사항들만 알고 있다.

1. 동기적으로 액션을 디스패치하기
2. root 리듀서를 호출해 상태 업데이트
3. UI에게 변경사항을 알리기

비동기적인 일들은 스토어 밖에서 일어나야 한다. 이를 리덕스 미들웨어가 처리해준다.

## 리덕스 비동기 흐름

![리덕스 비동기 흐름](https://redux.js.org/assets/images/ReduxAsyncDataFlowDiagram-d97ff38a0f4da0f327163170ccc13e80.gif)

## Redux-thunk

썽크란?

> 컴퓨터 프로그래밍에서, 썽크(Thunk)는 기존의 서브루틴에 추가적인 연산을 삽입할 때 사용되는 서브루틴이다. 썽크는 주로 연산 결과가 필요할 때까지 연산을 지연시키는 용도로 사용되거나, 기존의 다른 서브루틴들의 시작과 끝 부분에 연산을 추가시키는 용도로 사용되는데, 컴파일러 코드 생성시와 모듈화 프로그래밍 방법론 등에서는 좀 더 다양한 형태로 활용되기도 한다. <br><br>썽크(Thunk)는 "고려하다"라는 영어 단어인 "Think"의 은어 격 과거분사인 "Thunk"에서 파생된 단어인데, 연산이 철저하게 "고려된 후", 즉 실행이 된 후에야 썽크의 값이 가용해지는 데서 유래된 것이라고 볼 수 있다

리덕스 썽크 미들웨어는 `dispatch` 에 액션 객체가 아닌, **함수**를 전달할 수 있게 해준다. 또한 미들웨어와 같이 `dispatch` 와 `getState` 를 매개변수로 받는다.

리덕스 썽크의 원본 소스 코드는 다음과 같다. 짧다.

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```
