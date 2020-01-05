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

function loadImage(path) {

}

function importLottieAssetsFromUrl(assets, url) {
	if (assets) {
		const imageAssets = assets
		.filter(asset => asset.id && asset.w)
		let i = 0, asset;
		for(i = 0; i < imageAssets.length; i += 1) {
			const assetId = random(10);
			asset = imageAssets[i];
			// var assetPath = 
			// sendCommand('importFile', [encodeURIComponent(path),encodeURIComponent(asset.u + asset.p), assetId]);
		}
		
	}
}

export {
	importLottieAssetsFromUrl,
	importLottieAssetsFromPath,
}