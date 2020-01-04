import actionTypes from '../actions/actionTypes'

let initialState = {
	state: 'idle',
  pendingCommands: 0,
}

function handleProcessStart(state, action) {
  return {
    ...state,
    state: 'processing',
  }
}

function handleProcessUpdate(state, action) {
  return {
    ...state,
    pendingCommands: action.data.pendingCommands
  }
}

function handleProcessEnd(state, action) {
  return {
    ...state,
    pendingCommands: action.pendingCommands,
    state: 'ended',
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
    case actionTypes.IMPORT_LOTTIE_PROCESS_UPDATE:
      return handleProcessUpdate(state, action);
    case actionTypes.IMPORT_LOTTIE_PROCESS_END:
      return handleProcessEnd(state, action);
    case actionTypes.IMPORT_LOTTIE_PROCESS_CANCEL:
      return handleCancel(state, action);
    case actionTypes.IMPORT_LEAVE:
      return handleLeave(state, action);
    default:
      return state
  }
}