import { call, put, takeEvery, select } from 'redux-saga/effects'
import actions from '../actions/actionTypes'
import fileBrowser from '../../helpers/FileBrowser'
import storingPathsSelector from '../selectors/storing_paths_selector'

function *importLottieFile(action) {
	try{
		let paths = yield select(storingPathsSelector)
		let filePath = yield call(fileBrowser, paths.previewPath)
		console.log('filePath', filePath)
		yield put({ 
			type: actions.IMPORT_LOTTIE_IMPORT_FILE_SUCCESS,
			path: filePath
		})
	} catch(err) {
		yield put({ 
				type: actions.IMPORT_LOTTIE_IMPORT_FILE_FAILED
		})
	}
}

export default [
  takeEvery(actions.IMPORT_LOTTIE_IMPORT_FILE, importLottieFile),
]