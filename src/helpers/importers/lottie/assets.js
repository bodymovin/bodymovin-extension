import {
	getLocalPath,
	downloadFile,
	saveFileFromBase64,
	createFolder,
} from '../../FileLoader'
import {
	getSeparator
} from '../../osHelper'
import sendCommand from './commandHelper'
import random from '../../randomGenerator'
import nodePath from '../../path_proxy'

const LOTTIE_IMAGES_IMPORT = 'lottie_images_import';

async function importLottieAssetsFromPath(assets, path) {
	if (assets) {
		const imageAssets = assets
		.filter(asset => asset.id && asset.w)
		let i = 0, asset;
		for (i = 0; i < imageAssets.length; i += 1) {
			asset = imageAssets[i];
			const assetId = random(10);
			let animationPath, assetName;
			if (!asset.e) {
				animationPath = path.substr(0, path.lastIndexOf(nodePath.sep) + 1);
				assetName = asset.u + asset.p;
			} else {
				animationPath = getLocalPath('Project') + getSeparator() + LOTTIE_IMAGES_IMPORT + getSeparator();
				const data = asset.p;
				const prefix = data.substr(0, data.indexOf(','));
				const extension = prefix.substr(prefix.indexOf('/') + 1,prefix.indexOf(';') - prefix.indexOf('/') - 1);
				const base64Data = data.substr(data.indexOf(',') + 1);
				assetName = assetId + '.' + extension;
				saveImageFromData(base64Data, assetName);
			}
			sendCommand('importFile', [encodeURIComponent(animationPath),encodeURIComponent(assetName), assetId]);
			asset.__sourceId = assetId;
		}
	}
}

async function saveImageFromData(base64Data, assetName) {
	const localPath = getLocalPath('Project');
	await createFolder(localPath + getSeparator(), LOTTIE_IMAGES_IMPORT);
	await saveFileFromBase64(base64Data, localPath + getSeparator() + LOTTIE_IMAGES_IMPORT + getSeparator() + assetName);
}

async function loadImage(asset, animationPath) {
	const localPath = getLocalPath('Project');
	await createFolder(localPath + getSeparator(), LOTTIE_IMAGES_IMPORT);
	await downloadFile(animationPath + asset.u + asset.p, localPath + getSeparator() + LOTTIE_IMAGES_IMPORT + getSeparator() + asset.p)
}

async function importLottieAssetsFromUrl(assets, jsonUrl) {
	if (assets) {
		const imageAssets = assets
		.filter(asset => asset.id && asset.w)
		let i = 0, asset;
		for (i = 0; i < imageAssets.length; i += 1) {
			const assetId = random(10);
			asset = imageAssets[i];
			const animationPath = jsonUrl.substr(0, jsonUrl.lastIndexOf('/') + 1);
			let assetName;
			if (asset.e) {
				const data = asset.p;
				const prefix = data.substr(0, data.indexOf(','));
				const extension = prefix.substr(prefix.indexOf('/') + 1,prefix.indexOf(';') - prefix.indexOf('/') - 1);
				const base64Data = data.substr(data.indexOf(',') + 1);
				assetName = assetId + '.' + extension;
				saveImageFromData(base64Data, assetName);
			} else {
				assetName = asset.p;
				await loadImage(asset, animationPath);
			}
			const localPath = getLocalPath('Project');
			sendCommand('importFile', [
				encodeURIComponent(localPath),
				encodeURIComponent(LOTTIE_IMAGES_IMPORT + getSeparator() + assetName), 
				assetId
			]);
			asset.__sourceId = assetId;
			// var assetPath = 
			// sendCommand('importFile', [encodeURIComponent(path),encodeURIComponent(asset.u + asset.p), assetId]);
		}
		
	}
}

export {
	importLottieAssetsFromUrl,
	importLottieAssetsFromPath,
}