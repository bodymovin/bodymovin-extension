import actionTypes from '../actions/actionTypes'

let routes = {
  compositions: 0,
  render: 1,
  preview: 2,
  settings: 3,
  fonts: 4,
  player: 5,
}

let initialState = {
	route: 0
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CHANGE_VIEW:
      return {...state, ...{route: action.route}}
    case actionTypes.RENDER_FONTS:
      return {...state, ...{route: routes.fonts}}
    case actionTypes.RENDER_SET_FONTS:
    case actionTypes.RENDER_START:
      return {...state, ...{route: routes.render}}
    case actionTypes.GOTO_PREVIEW:
      return {...state, ...{route: routes.preview}}
    case actionTypes.GOTO_PLAYER:
      return {...state, ...{route: routes.player}}
    case actionTypes.GOTO_SETTINGS:
      return {...state, ...{route: routes.settings}}
    case actionTypes.RENDER_STOP:
    case actionTypes.SETTINGS_CANCEL:
    case actionTypes.GOTO_COMPS:
      return {...state, ...{route: routes.compositions}}
    default:
      return state
  }
}