import Jimp from 'jimp/index.js'
import fs from 'fs'
var path = require('path');
path.parse = function(_path){
	return {
		dir:''
	}
}

function convertImage(path, image) {
	return new Promise(function(res, rej) {
		var opaque_image = image.clone().opaque()
		var diff = Jimp.diff(image, opaque_image, 0);
		if(diff.percent === 0) {
				var finalPath = path.replace(new RegExp('png' + '$'), 'jpg');
				var canvas = document.createElement('canvas');
				var imageData = image.bitmap;
				canvas.width = image.bitmap.width;
				canvas.height = image.bitmap.height;

				var ctx = canvas.getContext('2d')
				var palette = ctx.getImageData(0,0,image.bitmap.width,image.bitmap.height);
				var clamped = new Uint8ClampedArray(imageData.data);
				palette.data.set(clamped);
				ctx.putImageData(palette, 0, 0);

				var todata = canvas.toDataURL('image/jpeg', 0.8);
				var img = todata.replace(/^data:image\/\w+;base64,/, "");
				var buf = new Buffer(img, 'base64');
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
}

function processImage(path) {
	return new Promise(function(res, rej){
		Jimp.read(path)
		.then(function (image) {
			return convertImage(path, image)
			
		})
		.then(function (path) {
			res(path)
		})
		.catch(function(err){
			console.log('errerr: ', err)
			res('')
		})
	})
}

export default processImage