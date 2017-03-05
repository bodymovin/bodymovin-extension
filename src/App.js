import React, { Component } from 'react'
import { Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import Render from './views/render/Render'
import Compositions from './views/compositions/Compositions'
import SettingsView from './views/settings/Settings'
import PreviewView from './views/preview/Preview'
import FontsView from './views/fonts/Fonts'
import PlayerView from './views/player/Player'
import Alerts from './components/alerts/Alerts'
import reducer  from './redux/reducers/index'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './redux/sagas'
import './App.css';
import './reset.css';
import {setDispatcher} from './helpers/storeDispatcher'
import {getCompositions} from './redux/actions/compositionActions'
import {getPaths} from './redux/actions/generalActions'

const sagaMiddleware = createSagaMiddleware()

let composeStore = compose(
  applyMiddleware(
    sagaMiddleware
  )
)(createStore)

let store = composeStore(reducer)
sagaMiddleware.run(rootSaga)


class App extends Component {

  componentWillMount() {
    setDispatcher(store.dispatch)
  }

  componentDidMount() {
    store.dispatch(getCompositions())
    window.onfocus = function(){
      store.dispatch(getCompositions())
    }
    store.dispatch(getPaths())
  }
  render() {
    return (
      <Provider store={store}>
        <div>
          <Router history={browserHistory}>
            <Route path="/" component={Compositions} />
            <Route path="/render" component={Render} />
            <Route path="/preview" component={PreviewView} />
            <Route path="/settings/:id" component={SettingsView} />
            <Route path="/fonts" component={FontsView} />
            <Route path="/player" component={PlayerView} />
          </Router>
          <Alerts />
        </div>
      </Provider>
    );
  }
}

export default App
