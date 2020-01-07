import { call, put, takeEvery, select,take ,fork } from 'redux-saga/effects'
import actions from '../actions/actionTypes'
import {
	// nasaImageLoaded,
	catFactLoaded,
	lottieImportFileSuccess,
	lottieImportFileFailed,
} from '../actions/importActions'
import fileBrowser from '../../helpers/FileBrowser'
import storingPathsSelector from '../selectors/storing_paths_selector'
// import nasaHelper from '../../helpers/nasaHelper'
import catFactHelper from '../../helpers/catFactHelper'

function *importLottieFile(action) {
	try{
		let paths = yield select(storingPathsSelector)
		let filePath = yield call(fileBrowser, paths.importPath)
		yield put(lottieImportFileSuccess(filePath))
	} catch(err) {
		yield put(lottieImportFileFailed())
	}
}

// function *loadRandomAsset() {
// 	const nasaImage = yield call(nasaHelper)
// 	yield put(nasaImageLoaded(nasaImage))
// }

function *loadCatFact() {
	const catFact = yield call(catFactHelper)
	yield put(catFactLoaded(catFact))
}

function *loopRandomAsset() {
	while(true) {
		yield take([
			actions.IMPORT_LOTTIE_IMPORT_FILE_SUCCESS,
			actions.IMPORT_LOTTIE_LOAD_URL,
		])
		yield call(loadCatFact)
	}
}

export default [
  takeEvery(actions.IMPORT_LOTTIE_IMPORT_FILE, importLottieFile),
  fork(loopRandomAsset),
]