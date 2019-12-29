var path = require('path');
path.parse = function(_path){
	return {
		dir:''
	}
}

function ImageObject(_canvas, _img) {
	this.canvas = _canvas;
	this._img = _img;
	this.updateBitmap();
}

ImageObject.prototype.updateBitmap = function() {
	var context = this.canvas.getContext('2d');
	var imageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height);
	this.bitmap = imageData;
}

ImageObject.prototype.clone = function() {
	return new ImageObject(this.copyCanvas(), this._img);
}


ImageObject.prototype.opaque = function() {
	var canvasCtx = this.canvas.getContext('2d');
	canvasCtx.fillStyle = 'white';
	canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	canvasCtx.drawImage(this._img, 0, 0);
	this.updateBitmap();
	return this;
}

ImageObject.prototype.copyCanvas = function() {
	var clonedCanvas = document.createElement('canvas');
	clonedCanvas.width = this.canvas.width;
	clonedCanvas.height = this.canvas.height;
	var clonedCanvasCtx = clonedCanvas.getContext('2d');
	clonedCanvasCtx.drawImage(this._img, 0, 0);
	return clonedCanvas;
}

function compressImage(path, compression_rate) {
	path = path.replace(/\\/g, '/')
	return new Promise((resolve, reject) => {
		fetch('http://localhost:3119/processImage/', 
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
	const encodedImageResponse = await fetch('http://localhost:3119/encode/', 
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

			let encodedImage = await getEncodedFile(imagePath)
			encodedImage = `data:image/${imageCompressedData.extension === 'png' ? 'png' : 'jpeg'};base64,${encodedImage}`
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