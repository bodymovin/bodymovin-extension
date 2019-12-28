import actionTypes from '../actions/actionTypes'

let initialState = {
	show: false,
	type: '',
  pars:[]
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.RENDER_BLOCK:
    case actionTypes.WRITE_ERROR:
      return {...state, ...{show: true, pars:action.pars}}
    case actionTypes.PREVIEW_NO_CURRENT_RENDERS:
      return {...state, ...{show: true, pars:['You have no current renders to preview','Try browsing your files to select a .json file']}}
    case actionTypes.PREVIEW_ANIMATION_LOAD_FAILED:
      return {...state, ...{show: true, pars:['The animation could not be loaded']}}
    /*case actionTypes.GENERAL_LOG:
      return {...state, ...{show: true, pars:[action.data]}}*/
    case actionTypes.ALERT_HIDE:
      return {...state, ...{show: false}}
    default:
      return state
  }
}