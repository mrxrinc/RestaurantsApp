import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers/rootReducer'

let middleware = [thunk]

if (__DEV__) {
  const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default()

  const logger = createLogger({ collapsed: false })
  middleware = [...middleware, reduxImmutableStateInvariant, logger]
} else {
  middleware = [...middleware]
}

export default function configureStore() {
  const store = createStore(
    rootReducer,
    // window.devToolsExtention && window.devToolsExtention(),
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(
      applyMiddleware(...middleware)
    )
  )
  return store
}
