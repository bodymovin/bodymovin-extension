import actions from '../actions/actionTypes'
import { call, takeEvery, put, select } from 'redux-saga/effects'
import loadBodymovinFileData from '../../helpers/FileLoader'
import { 
	reportsLoaded,
	reportsLoadFailed,
} from '../actions/reportsActions'
import storingPathsSelector from '../selectors/storing_paths_selector'
import fileBrowser from '../../helpers/FileBrowser'

function *getReportData(action) {
	try {
		const reportData = yield call(loadBodymovinFileData, action.path)
		if ('version' in reportData) {
			yield put(reportsLoaded(reportData))
		}
	} catch(err) {
		console.log(err)
		yield put(reportsLoadFailed())
	}
}

function *handleImportSelected(action) {
	try {
		const paths = yield select(storingPathsSelector)
		const fileData = yield call(fileBrowser, paths.importPath)
		const reportData = yield call(loadBodymovinFileData, fileData.fsName)
		if ('version' in reportData) {
			yield put(reportsLoaded(reportData))
		}
	} catch(err) {
		console.log(err)
	}
}

export default [
  takeEvery(actions.GOTO_REPORTS, getReportData),
  takeEvery(actions.REPORTS_IMPORT_SELECTED, handleImportSelected),
]