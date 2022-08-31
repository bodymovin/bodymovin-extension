import { call, put, take, fork, select, takeEvery } from 'redux-saga/effects'
import actions from '../actions/actionTypes'
import {saveSettingsToLocalStorage, getSettingsFromLocalStorage} from '../../helpers/localStorageHelper'
import {getSimpleSeparator} from '../../helpers/osHelper'
import {
	getCompositions,
	getDestinationPath,
	renderNextComposition,
	stopRenderCompositions,
	getProjectPath,
	getSavingPath,
	createTempIdHeader,
} from '../../helpers/CompositionsProvider'
import getRenderComposition from '../selectors/render_composition_selector'
import storingPathsSelector from '../selectors/storing_paths_selector'
import settingsSelector from '../selectors/settings_selector'
import globalSettingsSelector from '../selectors/global_settings_selector'
import {
	applySettingsFromCache,
	settingsBannerLibraryFileSelected,
	settingsDefaultFolderPathSelected,
	settingsCopyPathPathSelected,
	settingsLoaded,
	templateLoaded,
} from '../actions/compositionActions'
import fileBrowser from '../../helpers/FileBrowser'
import folderBrowser from '../../helpers/FolderBrowser'
import loadBodymovinFileData from '../../helpers/FileLoader'
import validateTemplate from '../../helpers/templates/template'
import templateSelector from '../selectors/global_settings_template_selector'

function *getCSCompositions(action) {
	while(true) {
		yield take([actions.COMPOSITIONS_GET_COMPS, actions.APP_INITIALIZED, actions.APP_FOCUSED])
		yield call(getCompositions)
		yield call(getProjectPath)
		yield call(createTempIdHeader)
	}
}

function *getCompositionDestination() {
	while(true) {
		let action = yield take(actions.COMPOSITION_GET_DESTINATION)
		try{
			let paths = yield select(storingPathsSelector)
			let {
				shouldUseCompNameAsDefault,
				shouldUseAEPathAsDestinationFolder,
				shouldUsePathAsDefaultFolder,
				defaultFolderPath,
			} = yield select(globalSettingsSelector)
			let destinationPath = shouldUseAEPathAsDestinationFolder
				? `${paths.projectPath}${getSimpleSeparator()}`
				: shouldUsePathAsDefaultFolder && defaultFolderPath
					? `${defaultFolderPath.fsName}${getSimpleSeparator()}`
					: paths.destinationPath
			const compositions = yield call(getDestinationPath, action.comp, destinationPath, shouldUseCompNameAsDefault)
			if (compositions) {
				yield put({ 
						type: actions.COMPOSITIONS_UPDATED,
						compositions: compositions
				})
			}
		} catch(err) {

		}
	}
}

function *checkTemplateValidation(compData) {
	try {
		if (compData && compData.settings && compData.settings.template && compData.settings.template.active) {
			const templateData = yield select(templateSelector);
			if (templateData.templates && templateData.templates.list.length > compData.settings.template.id) {
				const selectedTemplate = templateData.templates.list[compData.settings.template.id];
				const jsonData = yield call(loadBodymovinFileData,compData.destination);
				const parser = selectedTemplate.parser;
				const errors = yield call(validateTemplate, jsonData, parser);
				if (errors.length) {
					yield put({ 
						type: actions.RENDER_TEMPLATE_ERROR,
						errors,
						compId: compData.id
					})
				}
			}
		}
	} catch (error) {
		console.log('ERROR', error);
	}
}

function *startRender() {
	let compData
	while(true) {
		const comp = yield select(getRenderComposition)
		if(comp) {
			const {
				shouldIncludeCompNameAsFolder,
			} = yield select(globalSettingsSelector)
			compData = {
				...comp,
			}
			if (shouldIncludeCompNameAsFolder) {
				const absoluteURISplit = compData.absoluteURI.split('/')
				absoluteURISplit.splice(absoluteURISplit.length - 1, 0, [comp.name])
				compData.absoluteURI = absoluteURISplit.join('/')
				const delimiter = getSimpleSeparator()
				const destinationSplit = compData.destination.split(delimiter)
				destinationSplit.splice(destinationSplit.length - 1, 0, [comp.name])
				compData.destination = destinationSplit.join(delimiter)
			}
			yield call(renderNextComposition, compData)
			yield take([actions.RENDER_COMPLETE])
			yield call(checkTemplateValidation, compData)
		} else {
			yield put({ 
				type: actions.RENDER_FINISHED
			})
			break;
		}
	}
}

function *stopRender(action) {
	yield call(stopRenderCompositions)
}

function *goToSettings() {
	yield put({ 
		type: actions.GOTO_SETTINGS
	})
}

function *saveSettings() {
	let settings = yield select(settingsSelector)
	yield call(saveSettingsToLocalStorage, settings)
}

function *applySettings(action) {
	try {
		const settings = yield call(getSettingsFromLocalStorage)
		yield put(applySettingsFromCache(settings, action.allComps))
	} catch(err) {
	}
}

function *searchLottiePath(action) {
	try{
		let paths = yield select(storingPathsSelector)
		const initialPath = action.value ? action.value.path : paths.destinationPath
		let filePath = yield call(fileBrowser, initialPath)
		yield put(settingsBannerLibraryFileSelected(filePath))
	} catch(err) {

	}
}

function *searchDefaultDestinationPath(action) {
	try{
		let paths = yield select(storingPathsSelector)
		const initialPath = action.value ? action.value.path : paths.defaultFolderPath
		let filePath = yield call(folderBrowser, initialPath)
		yield put(settingsDefaultFolderPathSelected(filePath))
	} catch(err) {
	}
}

function *searchSettingsCopyPath(action) {
	try{
		const path = yield call(getSavingPath, action.value ? action.value.absoluteURI: '')
		yield put(settingsCopyPathPathSelected(path))
	} catch(err) {
	}
}

function *loadSettings() {
	var result;
	try {
		result = window.cep.fs.showOpenDialogEx(false, false);
		if (result && result.data.length) {
			var readResult = window.cep.fs.readFile(result.data[0]);
        if(readResult.err === 0) {
					var jsonData = JSON.parse(readResult.data);
					yield put(settingsLoaded(jsonData))
	    } else {
			}
		}
	} catch(err) {
		console.log('err', err)
	}
}

function *handleRenderFinished() {
	const {
		shouldSkipDoneView,
	} = yield select(globalSettingsSelector)
	if (shouldSkipDoneView) {
		yield put({
			type: actions.GOTO_COMPS
		})
	}
}

function *loadTemplate() {
	var result;
	try {
		result = window.cep.fs.showOpenDialogEx(false, false);
		if (result && result.data.length) {
			var readResult = window.cep.fs.readFile(result.data[0]);
        if(readResult.err === 0) {
					var jsonData = JSON.parse(readResult.data);
					if (jsonData.type === 'template') {
						yield put(templateLoaded(jsonData))
					}
	    } else {
			}
		}
	} catch(err) {
		console.log('err', err)
	}
}

export default [
  fork(getCSCompositions),
  fork(getCompositionDestination),
  takeEvery(actions.RENDER_START, startRender),
  takeEvery(actions.RENDER_STOP, stopRender),
  takeEvery(actions.COMPOSITION_DISPLAY_SETTINGS, goToSettings),
  takeEvery(actions.SETTINGS_REMEMBER, saveSettings),
  takeEvery(actions.SETTINGS_APPLY, applySettings),
  takeEvery(actions.SETTINGS_BANNER_LIBRARY_FILE_UPDATE, searchLottiePath),
  takeEvery(actions.SETTINGS_DEFAULT_FOLDER_PATH_UPDATE, searchDefaultDestinationPath),
  takeEvery(actions.SETTINGS_COPY_PATH_UPDATE, searchSettingsCopyPath),
  takeEvery(actions.SETTINGS_LOAD, loadSettings),
  takeEvery(actions.RENDER_FINISHED, handleRenderFinished),
  takeEvery(actions.SETTINGS_TEMPLATES_LOAD, loadTemplate),
]