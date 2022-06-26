import { call, put, take, select, fork, takeEvery } from 'redux-saga/effects'
import actions from '../actions/actionTypes'
import {
	getProjectFromLocalStorage, 
	saveProjectToLocalStorage, 
	savePathsToLocalStorage, 
	getPathsFromLocalStorage,
	clearLocalStorage,
	clearProjectsInLocalStorage,
	getAllProjectsNamedFromLocalStorage,
	compressAllProjects,
} from '../../helpers/localStorageHelper'
import {
	loadFileData
} from '../../helpers/FileLoader'
import {
	getVersionFromExtension,
	setLottiePaths,
	initializeServer,
	saveProjectDataToXMP,
	getProjectDataFromXMP,
	setStorageLocation,
	getStorageLocation,
	getCompressedState,
	setCompressedState,
} from '../../helpers/CompositionsProvider'
import {ping as serverPing} from '../../helpers/serverHelper'
import storingDataSelector from '../selectors/storing_data_selector'
import storingPathsSelector from '../selectors/storing_paths_selector'
import LottieVersions from '../../helpers/LottieVersions'
import fs from '../../helpers/fs_proxy'

const delay = (ms) => new Promise(res => setTimeout(res, ms))

function *projectGetStoredData(action) {
	try{
		const storageLocation = yield call(getStorageLocation);
		let projectData;
		if (storageLocation === 'xmp') {
			projectData = yield call(getProjectDataFromXMP);
		} else {
			projectData = yield call(getProjectFromLocalStorage, action.id);
		}
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
function *getVersion(action) {
	try{
		yield call(getVersionFromExtension)
	} catch(err){
	}
}

function saveProjectDataToPath(data) {
	try {
		if (data.extraState.shouldKeepCopyOfSettings
			&& data.extraState.settingsDestinationCopy) {
				fs.writeFileSync(data.extraState.settingsDestinationCopy.destination, JSON.stringify(data))
		}
	} catch (err) {
	}
}

function *saveStoredData() {
	while(true) {
		yield take([
			actions.COMPOSITION_SET_DESTINATION, 
			actions.COMPOSITIONS_TOGGLE_ITEM, 
			actions.SETTINGS_TOGGLE_VALUE, 
			actions.SETTINGS_TOGGLE_EXTRA_COMP, 
			actions.SETTINGS_CANCEL,
			actions.SETTINGS_BANNER_WIDTH_UPDATED,
			actions.SETTINGS_BANNER_HEIGHT_UPDATED,
			actions.SETTINGS_BANNER_ORIGIN_UPDATED,
			actions.SETTINGS_BANNER_VERSION_UPDATED,
			actions.SETTINGS_BANNER_LIBRARY_PATH_UPDATED,
			actions.SETTINGS_BANNER_RENDERER_UPDATED,
			actions.SETTINGS_BANNER_CLICK_TAG_UPDATED,
			actions.SETTINGS_BANNER_ZIP_FILES_UPDATED,
			actions.SETTINGS_BANNER_INCLUDE_DATA_IN_TEMPLATE_UPDATED,
			actions.SETTINGS_BANNER_CUSTOM_SIZE_UPDATED,
			actions.SETTINGS_APPLY_FROM_CACHE,
			actions.SETTINGS_MODE_TOGGLE,
			actions.SETTINGS_BANNER_LOOP_TOGGLE,
			actions.SETTINGS_BANNER_LOOP_COUNT_CHANGE,
			actions.SETTINGS_COMP_NAME_AS_DEFAULT_TOGGLE,
			actions.SETTINGS_AE_AS_PATH_TOGGLE,
			actions.SETTINGS_PATH_AS_DEFAULT_FOLDER,
			actions.SETTINGS_INCLUDE_COMP_NAME_AS_FOLDER_TOGGLE,
			actions.SETTINGS_DEFAULT_FOLDER_PATH_SELECTED,
			actions.COMPOSITIONS_FILTER_CHANGE,
			actions.SETTINGS_TOGGLE_SELECTED,
			actions.SETTINGS_BANNER_LIBRARY_FILE_SELECTED,
			actions.REPORTS_SAVED,
			actions.REPORTS_RENDERERS_UPDATED,
			actions.REPORTS_MESSAGES_UPDATED,
			actions.REPORTS_BUILDERS_UPDATED,
			actions.SETTINGS_DEMO_BACKGROUND_COLOR_CHANGE,
			actions.PREVIEW_COLOR_UPDATE,
			actions.SETTINGS_UPDATE_VALUE,
			actions.SETTINGS_METADATA_CUSTOM_PROP_ADD,
			actions.SETTINGS_METADATA_CUSTOM_PROP_DELETE,
			actions.SETTINGS_METADATA_CUSTOM_PROP_TITLE_CHANGE,
			actions.SETTINGS_METADATA_CUSTOM_PROP_VALUE_CHANGE,
			actions.COMPOSITIONS_SELECT_ALL,
			actions.COMPOSITIONS_UNSELECT_ALL,
			actions.COMPOSITIONS_UNSELECT_ALL,
			actions.SETTINGS_PROJECT_SETTINGS_COPY,
			actions.SETTINGS_COPY_PATH_SELECTED,
			actions.SETTINGS_LOADED,
			actions.SETTINGS_SAVE_IN_PROJECT_FILE,
		])
		const storingData = yield select(storingDataSelector)
		try {
			yield call(saveProjectDataToPath, storingData.data)
			if (storingData.data.extraState.shouldSaveInProjectFile) {
				yield call(saveProjectDataToXMP, storingData.data)
			} else {
				yield call(setStorageLocation, 'localStorage');
				yield call(saveProjectToLocalStorage, storingData.data, storingData.id)
			}
		} catch (error) {
			// Local storage exceeded
			if (error && error.code === 22) {
				const projects = yield call(getAllProjectsNamedFromLocalStorage);
				yield put({ 
					type: actions.SETTINGS_SAVE_FAILED,
					projects,
			})
			}
		}
	}
}

function *clearCache() {
	try {
		yield call(clearLocalStorage)
	} catch(err) {
	}
}

function *clearProjectsFromCache(action) {
	try {
		yield call(clearProjectsInLocalStorage, action.ids)
	} catch(err) {
	}
}

function *savePathsData() {
	while(true) {
		yield take([actions.COMPOSITION_SET_DESTINATION, actions.PREVIEW_FILE_BROWSED, actions.IMPORT_LOTTIE_IMPORT_FILE_SUCCESS])
		const storingData = yield select(storingPathsSelector)
		yield call(savePathsToLocalStorage, storingData)
	}
}

function *getLottieFilesSizes() {
	let i = 0
	while (i < LottieVersions.length) {
		const lottieData = LottieVersions[i] 
		const fileData = yield call(loadFileData, `assets/player/${lottieData.local}` )
		lottieData.fileSize = Math.round(fileData.size / 100) / 10 + ' Kb'
		i += 1
	}
	setLottiePaths(LottieVersions)
}

function *pingServer() {
	while(true) {
		yield call(delay, 5000)
		yield call(serverPing)
	}
}

function *start() {
	while(true) {
		yield call(initializeServer)
		try {
			yield call(pingServer)
		} catch (err) {
			yield put({ 
					type: actions.SERVER_PING_FAIL,
			})
		}
	}
}

function *compressAllSettings() {
	try {
		const isCompressed = yield call(getCompressedState);
		if (!isCompressed) {
			yield call(compressAllProjects);
			yield call(setCompressedState, true);
		}
	} catch (error) {
		// console.log(error);
	}
}

export default [
  takeEvery(actions.PROJECT_SET_ID, projectGetStoredData),
  takeEvery([actions.APP_INITIALIZED], getPaths),
  takeEvery([actions.APP_INITIALIZED], getVersion),
  takeEvery([actions.APP_INITIALIZED], getLottieFilesSizes),
  takeEvery([actions.APP_INITIALIZED], start),
  takeEvery([actions.PROJECT_SET_ID], compressAllSettings),
  takeEvery([actions.APP_CLEAR_CACHE_CONFIRMED], clearCache),
  takeEvery([actions.APP_CLEAR_CACHE_PROJECTS], clearProjectsFromCache),
  fork(saveStoredData),
  fork(savePathsData)
]