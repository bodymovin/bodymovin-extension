import fs from 'fs'
//import pngToJpeg from 'png-to-jpeg'
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

function loadImage(path) {
	return new Promise(function(res, rej){

		var img = document.createElement('img');
		img.onload = function(){
			var canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);

			res(new ImageObject(canvas, img));
		}
		img.src = path;
	});
}

function saveNewImage(path, todata) {
	return new Promise(function(res, rej){
		var img = todata.replace(/^data:image\/\w+;base64,/, "");
		//Use window.Buffer instead of Buffer because they differ and Bufer doesn't work with older AE versions
		var buf = new window.Buffer(img, 'base64');
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

function difference(image1, image2) {
	var percent = 0
	var data1 = image1.bitmap.data
	var data2 = image2.bitmap.data
	var i = 0, len = data1.length;
	while(i < len) {
		if(data1[i] !== data2[i]){
			percent = 1;
			break;
		}
		i += 1;
	}

	return {
		percent: percent
	}
}

function compressAndSave(image, data) {
	return new Promise(function(res, rej){
		var opaque_image = image.clone().opaque()
		var diff = difference(image, opaque_image, 0);
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
	var diff = difference(image, opaque_image, 0);
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
		loadImage(path)
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