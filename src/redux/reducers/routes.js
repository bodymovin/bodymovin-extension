import actionTypes from '../actions/actionTypes'

let routes = {
  compositions: 0,
  render: 1,
  preview: 2,
  settings: 3,
  fonts: 4,
  player: 5,
  importFile: 6,
  annotations: 7,
  reports: 8,
  supported_features: 9,
}

let initialState = {
	route: routes.compositions
}

function handleRenderFonts(state, action) {
  if (!action.data.bundleFonts) {
    return {...state, ...{route: routes.fonts}}
  } else {
    return state
  }
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CHANGE_VIEW:
      return {...state, ...{route: action.route}}
    case actionTypes.RENDER_FONTS:
      return handleRenderFonts(state, action)
    case actionTypes.RENDER_SET_FONTS:
    case actionTypes.RENDER_START:
      return {...state, ...{route: routes.render}}
    case actionTypes.GOTO_PREVIEW:
    case actionTypes.PREVIEW_ANIMATION:
      return {...state, ...{route: routes.preview}}
    case actionTypes.GOTO_PLAYER:
      return {...state, ...{route: routes.player}}
    case actionTypes.GOTO_SETTINGS:
      return {...state, ...{route: routes.settings}}
    case actionTypes.GOTO_IMPORT:
      return {...state, ...{route: routes.importFile}}
    case actionTypes.RENDER_STOP:
    case actionTypes.SETTINGS_CANCEL:
    case actionTypes.GOTO_COMPS:
      return {...state, ...{route: routes.compositions}}
    case actionTypes.GOTO_ANNOTATIONS:
      return {...state, ...{route: routes.annotations}}
    case actionTypes.GOTO_REPORTS:
      return {...state, ...{route: routes.reports}}
    case actionTypes.GOTO_SUPPORTED_FEATURES:
      return {...state, ...{route: routes.supported_features}}
    default:
      return state
  }
}

export {
  routes
}