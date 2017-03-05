import actionTypes from '../actions/actionTypes'

let initialState = {
	id: ''
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PROJECT_SET_ID:
      return {...state, ...{id: action.id}}
    default:
      return state
  }
}