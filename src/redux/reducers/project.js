import actionTypes from '../actions/actionTypes'

let initialState = {
	id: '',
	version: '',
  app_version: ''
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PROJECT_SET_ID:
      return {...state, ...{id: action.id}}
    case actionTypes.VERSION_FETCHED:
      return {...state, ...{version: action.version}}
    case actionTypes.APP_VERSION_FETCHED:
      return {...state, ...{app_version: action.version ? action.version.substr(0, action.version.indexOf('x')) : '0.0.0'}}
    default:
      return state
  }
}