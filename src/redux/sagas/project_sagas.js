import { call, put, take, select, fork, takeEvery } from 'redux-saga/effects'
import actions from '../actions/actionTypes'
import {getProjectFromLocalStorage, saveProjectToLocalStorage, savePathsToLocalStorage, getPathsFromLocalStorage} from '../../helpers/localStorageHelper'
import storingDataSelector from '../selectors/storing_data_selector'
import storingPathsSelector from '../selectors/storing_paths_selector'

function *projectGetStoredData(action) {
	try{
		let projectData = yield call(getProjectFromLocalStorage, action.id)
		if(projectData) {
			yield put({ 
					type: actions.PROJECT_STORED_DATA,
					projectData: projectData
			})
		}
	} catch(err){
		
	}
}
function *getPaths(action) {
	try{
		let pathsData = yield call(getPathsFromLocalStorage)
		if(pathsData) {
			yield put({ 
					type: actions.PATHS_FETCHED,
					pathsData: pathsData
			})
		}
	} catch(err){
	}
}

function *saveStoredData() {
	while(true) {
		yield take([actions.COMPOSITION_SET_DESTINATION, actions.COMPOSITIONS_TOGGLE_ITEM, actions.COMPOSITIONS_UPDATED, actions.SETTINGS_TOGGLE_VALUE, actions.SETTINGS_TOGGLE_EXTRA_COMP, actions.SETTINGS_CANCEL])
		const storingData = yield select(storingDataSelector)
		yield call(saveProjectToLocalStorage, storingData.data, storingData.id)
	}
}

function *savePathsData() {
	while(true) {
		yield take([actions.COMPOSITION_SET_DESTINATION, actions.PREVIEW_FILE_BROWSED])
		const storingData = yield select(storingPathsSelector)
		yield call(savePathsToLocalStorage, storingData)
	}
}

export default [
  takeEvery(actions.PROJECT_SET_ID, projectGetStoredData),
  takeEvery(actions.PATHS_GET, getPaths),
  fork(saveStoredData),
  fork(savePathsData)
]