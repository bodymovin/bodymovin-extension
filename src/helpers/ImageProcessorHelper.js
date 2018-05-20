import Jimp from 'jimp/index.js'
import fs from 'fs'
var path = require('path');
path.parse = function(_path){
	return {
		dir:''
	}
}

/*function convertImage(path, compression, image) {
	return new Promise(function(res, rej) {
		var opaque_image = image.clone().opaque()
		var diff = Jimp.diff(image, opaque_image, 0);
		if(diff.percent === 0) {
				var canvas = document.createElement('canvas');
				var imageData = image.bitmap;
				canvas.width = image.bitmap.width;
				canvas.height = image.bitmap.height;

				var ctx = canvas.getContext('2d')
				var palette = ctx.getImageData(0,0,image.bitmap.width,image.bitmap.height);
				var clamped = new Uint8ClampedArray(imageData.data);
				palette.data.set(clamped);
				ctx.putImageData(palette, 0, 0);

				var todata = canvas.toDataURL('image/jpeg', compression);
				var img = todata.replace(/^data:image\/\w+;base64,/, "");
				var buf = new Buffer(img, 'base64');
				var finalPath = path.replace(new RegExp('png$'), 'jpg');
				fs.writeFile(finalPath, buf, function(err) {
					if(err) {
						res('')
					} else {
						res(finalPath)
					}
				});
		} else {
			res('')
		}
	})
}*/

function saveNewImage(path, todata) {
	return new Promise(function(res, rej){
		var img = todata.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(img, 'base64');
		var finalPath = path.replace(new RegExp('png$'), 'jpg');
		fs.writeFile(finalPath, buf, function(err) {
			if(err) {
				res('')
			} else {
				res(finalPath)
			}
		});
	})
}

function compressCanvas(canvas, compression_rate) {
	return new Promise(function(res, rej){
		var todata = canvas.toDataURL('image/jpeg', compression_rate);
		res(todata)
	})
}

function convertCanvasToData(canvas) {
	return new Promise(function(res, rej){
		var todata = canvas.toDataURL('image/png');
		res(todata)
	})
}

function getDrawnCanvas(image) {
	return new Promise(function(res, rej){
		var canvas = document.createElement('canvas');
		var imageData = image.bitmap;
		canvas.width = image.bitmap.width;
		canvas.height = image.bitmap.height;

		var ctx = canvas.getContext('2d')
		var palette = ctx.getImageData(0,0,image.bitmap.width,image.bitmap.height);
		var clamped = new Uint8ClampedArray(imageData.data);
		palette.data.set(clamped);
		ctx.putImageData(palette, 0, 0);
		res(canvas);
	})
}

function compressAndSave(image, data) {
	return new Promise(function(res, rej){
		var opaque_image = image.clone().opaque()
		var diff = Jimp.diff(image, opaque_image, 0);
		if(diff.percent === 0) {
			getDrawnCanvas(image)
			.then(function(canvas){
				return compressCanvas(canvas, data.compression_rate)
			})
			.then(function(image_data){
				return saveNewImage(data.path, image_data)
			})
			.then(function(new_path){
				res({
					new_path: new_path,
					encoded: false,
					compressed: true
				})
			})
			.catch(function(err){
				rej()
			})
		} else {
			rej()
		}
	})
}

function compressAndEncode(image, data) {
	var opaque_image = image.clone().opaque()
	var diff = Jimp.diff(image, opaque_image, 0);
	if(diff.percent === 0) {
		return new Promise(function(res, rej){
			getDrawnCanvas(image)
			.then(function(canvas){
				return compressCanvas(canvas, data.compression_rate)
			})
			.then(function(encoded_data){
				res({
					new_path: '',
					encoded_data: encoded_data,
					encoded: true,
					compressed: true
				})
			})
		})
	} else {
		return encode(image, data)
	}
}

function encode(image, data) {
	return new Promise(function(res, rej){
		getDrawnCanvas(image)
		.then(convertCanvasToData)
		.then(function(encoded_data){
			res({
				new_path: '',
				encoded_data: encoded_data,
				encoded: true,
				compressed: false
			})
		})
	})
}

function processImage(actionData) {

	let path = actionData.path

	return new Promise(function(res, rej){
		var _image;
		Jimp.read(path)
		.then(function (image) {
			if(actionData.should_encode_images && actionData.should_compress) {
				return compressAndEncode(image, actionData)
			} else if(actionData.should_compress) {
				return compressAndSave(image, actionData)
			} else if(actionData.should_encode_images) {
				return encode(image, actionData)
			} else {
				return Promise.reject()
			}
		})
		.then(function(response){
			res(response)
		})
		.catch(function(err){
			res({
				encoded: false,
				compressed: false
			})
		})
	})
}

export default processImage