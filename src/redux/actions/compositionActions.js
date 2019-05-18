import actionTypes from './actionTypes'

function filterChange(event) {
	return {
		type: actionTypes.COMPOSITIONS_FILTER_CHANGE,
		value: event.target.value
	}
}

function toggleItem(comp) {
	return {
		type: actionTypes.COMPOSITIONS_TOGGLE_ITEM,
		id: comp.id
	}
}

function getCompositions() {
	return {
		type: actionTypes.COMPOSITIONS_GET_COMPS
	}
}

function setDestination(comp) {
	return {
		type: actionTypes.COMPOSITION_SET_DESTINATION,
		comp: comp
	}
}

function getDestination(comp) {
	return {
		type: actionTypes.COMPOSITION_GET_DESTINATION,
		comp: comp
	}
}

function displaySettings(id) {
	return {
		type: actionTypes.COMPOSITION_DISPLAY_SETTINGS,
		id: id
	}
}

function setCurrentCompId(id) {
	return {
		type: actionTypes.COMPOSITIONS_SET_CURRENT_COMP_ID,
		id: id
	}
}

function cancelSettings(storedSettings) {
	return {
		type: actionTypes.SETTINGS_CANCEL,
		storedSettings: storedSettings
	}
}

function toggleSettingsValue(name) {
	return {
		type: actionTypes.SETTINGS_TOGGLE_VALUE,
		name: name
	}
}

function updateSettingsValue(name, value) {
	return {
		type: actionTypes.SETTINGS_UPDATE_VALUE,
		value: value,
		name: name
	}
}

function toggleExtraComp(id) {
	return {
		type: actionTypes.SETTINGS_TOGGLE_EXTRA_COMP,
		id: id,
	}
}

function goToPreview() {
	return {
		type: actionTypes.GOTO_PREVIEW,
	}
}

function goToPlayer() {
	return {
		type: actionTypes.GOTO_PLAYER,
	}
}

function goToComps() {
	return {
		type: actionTypes.GOTO_COMPS,
	}
}

function toggleShowSelected() {
	return {
		type: actionTypes.SETTINGS_TOGGLE_SELECTED,
	}
}

function rememberSettings() {
	return {
		type: actionTypes.SETTINGS_REMEMBER,
	}
}

function applySettings() {
	return {
		type: actionTypes.SETTINGS_APPLY,
		allComps: false
	}
}

function applySettingsToSelectedComps(settings) {
	return {
		type: actionTypes.SETTINGS_APPLY,
		settings,
		allComps: true
	}
}

function applySettingsFromCache(settings, allComps) {
	return {
		type: actionTypes.SETTINGS_APPLY_FROM_CACHE,
		settings,
		allComps
	}
}

export {
	filterChange,
	toggleShowSelected,
	toggleItem,
	getCompositions,
	getDestination,
	setDestination,
	displaySettings,
	setCurrentCompId,
	cancelSettings,
	toggleSettingsValue,
	toggleExtraComp,
	updateSettingsValue,
	goToPreview,
	goToPlayer,
	goToComps,
	rememberSettings,
	applySettings,
	applySettingsFromCache,
	applySettingsToSelectedComps,
}