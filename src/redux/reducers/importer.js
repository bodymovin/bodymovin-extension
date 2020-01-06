import actionTypes from '../actions/actionTypes'

let initialState = {
	state: 'idle',
  pendingCommands: 0,
  messages: [],
  image: {},
  fact: {},
}

function handleProcessStart(state, action) {
  return {
    ...state,
    state: 'processing',
  }
}

function handleProcessStartFromUrl(state, action) {
  return {
    ...state,
    state: 'loading',
  }
}

function handleProcessUpdate(state, action) {
  return {
    ...state,
    state: 'processing',
    pendingCommands: action.data.pendingCommands
  }
}

function handleProcessEnd(state, action) {
  return {
    ...state,
    pendingCommands: 0,
    messages: action.data.alerts,
    state: 'ended',
  }
}

function handleProcessFailed(state, action) {
  return {
    ...state,
    pendingCommands: 0,
    messages: [{
      type: 'message',
      message: action.error.message
    }],
    state: 'failed',
  }
}

function handleImageLoaded(state, action) {
  return {
    ...state,
    image: action.data,
  }
}

function handleCatFactLoaded(state, action) {
  return {
    ...state,
    fact: action.data,
  }
}

function handleLeave(state, action) {
  return {
    ...state,
    ...initialState,
  }
}

function handleCancel(state, action) {
  return {
    ...state,
    ...initialState,
  }
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.IMPORT_LOTTIE_IMPORT_FILE_SUCCESS:
      return handleProcessStart(state, action);
    case actionTypes.IMPORT_LOTTIE_LOAD_URL:
      return handleProcessStartFromUrl(state, action);
    case actionTypes.IMPORT_LOTTIE_PROCESS_UPDATE:
      return handleProcessUpdate(state, action);
    case actionTypes.IMPORT_LOTTIE_PROCESS_END:
      return handleProcessEnd(state, action);
    case actionTypes.IMPORT_LOTTIE_PROCESS_FAILED:
      return handleProcessFailed(state, action);
    case actionTypes.IMPORT_LOTTIE_PROCESS_CANCEL:
      return handleCancel(state, action);
    case actionTypes.IMPORT_LEAVE:
      return handleLeave(state, action);
    case actionTypes.NASA_IMAGE_LOADED:
      return handleImageLoaded(state, action);
    case actionTypes.CAT_FACT_LOADED:
      return handleCatFactLoaded(state, action);
    default:
      return state
  }
}