import actionTypes from '../actions/actionTypes'

let initialState = {
	message: '',
  progress: 0,
  finished: false,
  cancelled: false,
  fonts: []
}

function updateRenderData(state, action) {
  let newState = {...state, ...{message: action.data.message, progress: action.data.progress}}
  return newState
}

function updateFontsData(state, action) {
  let fontFormData = {
    origin: 0,
    fPath:'',
    fClass:'',
    fFamily:'',
    fWeight:'',
    fStyle:'',
    fName:''
  }
  let fonts = []
  let item, i, len = action.data.fonts.length
  for(i = 0; i < len; i += 1) {
    item = action.data.fonts[i]
    fonts.push({...fontFormData,...{fFamily: item.family, fStyle: item.style, fName: item.name}})
  }
  let newState = {...state, ...{fonts: fonts}}
  return newState
}

function updateFontOrigin(state, action) {
  let fonts = state.fonts
  let index = fonts.indexOf(action.item)
  let newFontData = {...fonts[index], ...{origin: action.origin}}
  let newFonts = [...fonts.slice(0,index),newFontData,...fonts.slice(index + 1)]
  let newState ={...state, ...{fonts: newFonts}}
  return newState
}

function updateInput(state, action) {
  let fonts = state.fonts
  let index = fonts.indexOf(action.item)
  let newFontData = {...fonts[index], ...{[action.inputName]: action.value}}
  let newFonts = [...fonts.slice(0,index),newFontData,...fonts.slice(index + 1)]
  let newState ={...state, ...{fonts: newFonts}}
  return newState
}

function updateFontFromLocalData(state, action) {
  let fonts = state.fonts
  let storedFonts = action.storedFonts
  if(!storedFonts){
    return state
  }
  let len = storedFonts.length
  let i
  let newFonts = fonts.map(function(item) {
    i = 0
    while(i<len) {
      if(item.fName === storedFonts[i].fName && storedFonts[i].data){
        return storedFonts[i].data
      }
      i += 1
    }
    return item
  })
  let newState ={...state, ...{fonts: newFonts}}
  return newState
}

function finishRender(state, action) {
  let newState ={...state, ...{finished: true, message: 'Renders Finished'}}
  return newState
}

function startRender(state, action) {
  let newState = initialState
  return newState
}

function stopRender(state, action) {
  let newState = {...state, ...{cancelled: true}}
  return newState
}

export default function compositions(state = initialState, action) {
  switch (action.type) {
    case actionTypes.RENDER_UPDATE:
      return updateRenderData(state, action)
    case actionTypes.RENDER_START:
      return startRender(state, action)
    case actionTypes.RENDER_STOP:
      return stopRender(state, action)
    case actionTypes.RENDER_FINISHED:
      return finishRender(state, action)
    case actionTypes.RENDER_FONTS:
      return updateFontsData(state, action)
    case actionTypes.RENDER_UPDATE_FONT_ORIGIN:
      return updateFontOrigin(state, action)
    case actionTypes.RENDER_STORED_FONTS_FETCHED:
      return updateFontFromLocalData(state, action)
    case actionTypes.RENDER_UPDATE_INPUT:
      return updateInput(state, action)
    default:
      return state
  }
}