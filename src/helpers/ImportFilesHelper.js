import csInterface from './CSInterfaceHelper'

function convertLottieFileFromPath(path) {
	console.log('pathpath', path)
	csInterface.evalScript('$.__bodymovin.bm_lottieImporter.importFromPath("' + encodeURIComponent(path) + '")');
}

export {
	convertLottieFileFromPath
}