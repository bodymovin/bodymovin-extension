import sendCommand from './commandHelper'
import random from '../../randomGenerator'

function importLottieAssetsFromPath(assets, path) {
	if (assets) {
		assets
		.filter(asset => asset.id && asset.w)
		.forEach(asset => {
			const assetId = random(10);
			sendCommand('importFile', [encodeURIComponent(path),encodeURIComponent(asset.u + asset.p), assetId]);
			asset.__sourceId = assetId;
		})
	}
}

function importLottieAssetsFromUrl(assets, url) {

}

export {
	importLottieAssetsFromUrl,
	importLottieAssetsFromPath,
}