# 리덕스 미들웨어

인핸서는 파워풀하다. 인핸서는 스토어의 모든 메서드를(`dispatch`, `getState`, `subscribe`) 덮어쓰거나 대체할 수 있다.

그런데, 대부분의 `dispatch` 의 작동만 커스터마이징할 경우가 많을 것이다. 리덕스는 **미들웨어**라 불리는 특별한 종류의 애드온을 사용한다. 미들웨어를 통해 `dispatch` 함수를 커스터마이징할 수 있다.

미들웨어를 통해 로깅, 오류 리포트, 비동기 API 통신, 라우팅 등을 하는 데 사용할 수 있다.

미들웨어는 스토어의 `dispatch` 메서드를 둘러싼 파이프라인을 형성한다. 우리가 `store.dispatch(action)` 을 실행할 때, *실제로는* 미들웨어의 첫번째 파이프라인을 실행하는 것이다.

리듀서와는 다르게, **미들웨어는 내부에 타임아웃이나 비동기 로직등의 사이드 이펙트를 가질 수 있다.**

**리덕스 미들웨어는 3개의 중첩함수를 가진다.**

```js
// Middleware written as ES5 functions

// Outer function:
function exampleMiddleware(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      // Do anything here: pass the action onwards with next(action),
      // or restart the pipeline with storeAPI.dispatch(action)
      // Can also use storeAPI.getState() here

      return next(action)
    }
  }
}
```

- `exampleMiddleware` : 가장 바깥의 함수로, 미들웨어 그 자체이다. `applyMiddleware`에 의해 호출되고, 스토어의 `{dispatch, getState}` 함수를 가진 `storeAPI` 객체를 받는다. store의 해당 함수와 같다. `dispatch` 함수를 호출하면, 액션을 첫번째 미들웨어 파이프라인으로 보낸다. 한번만 실행된다.
- `wrapDispatch` : 가운데 함수는 매개변수로 `next` 라 불리는 함수를 받는다.이 함수는 파이프라인의 *다음 미들웨어*이다. 만약 마지막 미들웨어라면, `next` 는 `store.dispatch` 함수가 된다. `next(action)` 을 호출하면 미들웨어에게 파이프라인의 다음 미들웨어를 넘겨준다. 한번만 실행된다.
- `handleAction` : 내부 함수는 현재 `action` 을 매개변수로 받는다. 액션이 디스패치될 때마다 매번 호출된다.

ES6 화살표 함수 버전

```js
const anotherExampleMiddleware = storeAPI => next => action => {
  // Do something in here, when each action is dispatched

  return next(action)
}
```
