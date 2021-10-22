import actionTypes from '../actions/actionTypes'
import Variables from '../../helpers/styles/variables'

let initialState = {
  progress: 0,
	timelineFrame: 0,
  animationData: null,
	path: null,
  timelineData: {},
  backgroundColor: Variables.colors.gray,
  shouldLockTimelineToComposition: false,
  shouldLoop: true,
}

function setStoredData(state, action) {
  return {
    ...state,
    backgroundColor: (action.projectData.preview && action.projectData.preview.backgroundColor)
      ? action.projectData.preview.backgroundColor
      : Variables.colors.gray,
    shouldLockTimelineToComposition: (action.projectData.preview && 'shouldLockTimelineToComposition' in action.projectData.preview)
      ? action.projectData.preview.shouldLockTimelineToComposition
      : false
  }
}

function updateTimelineData(state, action) {
  if (JSON.stringify(action.timelineData) === JSON.stringify(state.timelineData)) {
    return state
  } else {
    const timelineData = action.timeline
    const progress = (timelineData.time - timelineData.inPoint) / (timelineData.outPoint - timelineData.inPoint)
    return {
      ...state,
      timelineData: timelineData,
      progress: Math.max(0, Math.min(1, progress))
    }
  }
}

function updateProgress(state, action) {
  return {...state, ...{progress: action.progress}}
}

export default function project(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PREVIEW_ANIMATION_LOADED:
      return {...state, ...{
        animationData: action.animationData,
        assetsData: action.assetsData,
        path: action.path}
      }
    case actionTypes.PREVIEW_ANIMATION_PROGRESS:
      return updateProgress(state, action)
    case actionTypes.PREVIEW_TOTAL_FRAMES:
      return {...state, ...{totalFrames: action.totalFrames}}
    case actionTypes.PREVIEW_COLOR_UPDATE:
      return {...state, ...{backgroundColor: action.color}}
    case actionTypes.PREVIEW_LOCK_TIMELINE_TOGGLE:
      return {...state, ...{shouldLockTimelineToComposition: !state.shouldLockTimelineToComposition}}
    case actionTypes.PREVIEW_LOOP_TOGGLE:
      return {...state, ...{shouldLoop: !state.shouldLoop}}
    case actionTypes.PROJECT_STORED_DATA:
      return setStoredData(state, action)
    case actionTypes.PREVIEW_TIMELINE_UPDATED:
      return updateTimelineData(state, action)
    default:
      return state
  }
}