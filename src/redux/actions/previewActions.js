import actionTypes from './actionTypes'

function browsePreviewFile(event) {
	return {
		type: actionTypes.PREVIEW_BROWSE_FILE
	}
}

function previewFileBrowsed(event) {
	return {
		type: actionTypes.PREVIEW_FILE_BROWSED
	}
}

function updateProgress(progress) {
	return {
		type: actionTypes.PREVIEW_ANIMATION_PROGRESS,
		progress: progress
	}
}

function setTotalFrames(value) {
	return {
		type: actionTypes.PREVIEW_TOTAL_FRAMES,
		totalFrames: value
	}
}

function showNoCurrentRenders(pars) {
	return {
		type: actionTypes.PREVIEW_NO_CURRENT_RENDERS
	}
}

function previewFromPath(path) {
	return {
		type: actionTypes.PREVIEW_FILE_BROWSED,
		path: path
	}
}

function updateColor(color) {
	return {
		type: actionTypes.PREVIEW_COLOR_UPDATE,
		color
	}
}

function toggleLockTimeline() {
	return {
		type: actionTypes.PREVIEW_LOCK_TIMELINE_TOGGLE,
	}
}

function toggleLoop() {
	return {
		type: actionTypes.PREVIEW_LOOP_TOGGLE,
	}
}

function timelineUpdated(timeline) {
	return {
		type: actionTypes.PREVIEW_TIMELINE_UPDATED,
		timeline,
	}
}

function initialize() {
	return {
		type: actionTypes.PREVIEW_INITIALIZE,
	}
}

function finalize() {
	return {
		type: actionTypes.PREVIEW_FINALIZE,
	}
}

export {
	browsePreviewFile,
	previewFileBrowsed,
	updateProgress,
	setTotalFrames,
	showNoCurrentRenders,
	previewFromPath,
	updateColor,
	toggleLockTimeline,
	toggleLoop,
	timelineUpdated,
	initialize,
	finalize,
}