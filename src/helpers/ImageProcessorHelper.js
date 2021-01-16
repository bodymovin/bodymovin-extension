import { getPort } from './enums/networkData';
var path = require('path');
path.parse = function(_path){
	return {
		dir:''
	}
}

function compressImage(path, compression_rate) {
	path = path.replace(/\\/g, '/')
	return new Promise((resolve, reject) => {
		fetch(`http://localhost:${getPort()}/processImage/`, 
			{
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					path: encodeURIComponent(path),
					compression: compression_rate
				})
			})
		.then(async (response) => {
			const jsonResponse = await response.json()
			if (jsonResponse.status === 'error') {
				resolve({
					path,
					extension: 'png',
				})
			} else {
				setTimeout(() => {
					resolve({
						path: jsonResponse.path,
						extension: jsonResponse.extension,
					})
				}, 1)
			}
		})
		.catch((err) => {
			console.log('ERROR', err)
		})
	})
}

function handleImageCompression(path, settings) {
	if(settings.should_compress) {
		return compressImage(path, settings.compression_rate)
	} else {
		return Promise.resolve({
			path,
			extension: 'png',
		})
	}
}

async function getEncodedFile(path) {
	const encodedImageResponse = await fetch(`http://localhost:${getPort()}/encode/`, 
	{
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			path: encodeURIComponent(path),
		})
	})
	const jsonResponse = await encodedImageResponse.json()
	return jsonResponse.data

}

async function processImage(actionData) {
	let path = actionData.path

	try {

		if (!actionData.should_encode_images && !actionData.should_compress) {
			return {
				encoded: false,
			}
		}
		const imageCompressedData = await handleImageCompression(path, actionData)

		if (actionData.should_encode_images) {

			const imagePath = imageCompressedData.extension === 'png' ? 
				imageCompressedData.path
				:
				imageCompressedData.path.substr(0, imageCompressedData.path.lastIndexOf('.png')) + '.jpg'

			var fileExtension = imagePath.substr(imagePath.lastIndexOf('.') + 1)

			let encodedImage = await getEncodedFile(imagePath)

			if (actionData.assetType === 'audio') {
				encodedImage = `data:audio/mp3;base64,${encodedImage}`
			} else {
				encodedImage = `data:image/${fileExtension === 'png' ? 'png' : 'jpeg'};base64,${encodedImage}`
			}
			return {
				encoded_data: encodedImage,
				encoded: true,
				extension: imageCompressedData.extension
			}
			// const image = await loadImage(imagePath)
			// return await encode(image, actionData)
		} else {
			return {
				new_path: imageCompressedData.path,
				encoded: false,
				extension: imageCompressedData.extension
			}
		}
	} catch(err) {
		return {
			encoded: false,
		}
	}
}

export default processImage