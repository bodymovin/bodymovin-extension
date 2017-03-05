import { call, put, takeEvery, select } from 'redux-saga/effects'
import actions from '../actions/actionTypes'
import fileBrowser from '../../helpers/FileBrowser'
import loadBodymovinFileData from '../../helpers/FileLoader'
import storingPathsSelector from '../selectors/storing_paths_selector'

function *browseFile() {
	try{
		let paths = yield select(storingPathsSelector)
		let filePath = yield call(fileBrowser, paths.previewPath)
		yield put({ 
					type: actions.PREVIEW_FILE_BROWSED,
					path: filePath
			})
	} catch(err) {

	}
}

function *loadBodymovinFile(action) {
	try{
		let animationData = yield call(loadBodymovinFileData, action.path)
		yield put({ 
				type: actions.PREVIEW_ANIMATION_LOADED,
				animationData: animationData,
				path: action.path
		})
	} catch(err) {
		yield put({ 
				type: actions.PREVIEW_ANIMATION_LOAD_FAILED
		})
	}
}

export default [
  takeEvery(actions.PREVIEW_BROWSE_FILE, browseFile),
  takeEvery(actions.PREVIEW_FILE_BROWSED, loadBodymovinFile)
]