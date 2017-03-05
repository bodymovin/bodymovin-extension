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

export {
	browsePreviewFile,
	previewFileBrowsed,
	updateProgress,
	setTotalFrames,
	showNoCurrentRenders,
	previewFromPath
}