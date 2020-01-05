import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import ViewsContainer from './views/ViewsContainer'
import Alerts from './components/alerts/Alerts'
import Footer from './components/footer/Footer'
import reducer  from './redux/reducers/index'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './redux/sagas'
import extendScriptMiddleware from './redux/middlewares/extendScriptMiddleware'
import generalMiddleware from './redux/middlewares/generalMiddleware'
import './App.css';
import './reset.css';
import {setDispatcher} from './helpers/storeDispatcher'
import {appInitialized, appFocused} from './redux/actions/generalActions'

const sagaMiddleware = createSagaMiddleware()

let composeStore = compose(
  applyMiddleware(
    sagaMiddleware,
    extendScriptMiddleware,
    generalMiddleware,
  )
)(createStore)

let store = composeStore(reducer)
sagaMiddleware.run(rootSaga)


class App extends Component {

  componentWillMount() {
    setDispatcher(store.dispatch)
  }

  componentDidMount() {
    window.onfocus = function(){
      store.dispatch(appFocused())
    }
    store.dispatch(appInitialized())
  }


  render() {

    return (
      <Provider store={store}>
        <div style={{width:'100%',height:'100%'}}>
          <ViewsContainer />
          {/*<Router history={browserHistory}>
            <Route path="/" component={Compositions} />
            <Route path="/render" component={Render} />
            <Route path="/preview" component={PreviewView} />
            <Route path="/settings/:id" component={SettingsView} />
            <Route path="/fonts" component={FontsView} />
            <Route path="/player" component={PlayerView} />
          </Router>*/}
          <Footer />
          <Alerts />
        </div>
      </Provider>
    );
  }
}

export default App
