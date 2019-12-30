import csInterface from './CSInterfaceHelper'
import loadLottieData from './FileLoader'

async function convertLottieFileFromPath(path) {
	try {
		const lottieData = await loadLottieData(path)
		console.log('lottieData', lottieData)
		// csInterface.evalScript('$.__bodymovin.bm_lottieImporter.importFromPath("' + encodeURIComponent(path) + '")');
	} catch(err) {
	}
}

export {
	convertLottieFileFromPath
}