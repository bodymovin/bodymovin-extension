const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminJpegoptim = require('imagemin-jpegoptim');
const imageminPngquant = require('imagemin-pngquant');
const pngToJpeg = require('png-to-jpeg');
const express = require('express')
var fs = require('fs');
var bodyParser = require('body-parser');
var PNG = require('pngjs').PNG;
var LottieToFlare = require('./lottie_to_flare/test.bundle.js').default
var ltf = new LottieToFlare()

async function processImage(path, compression, hasTransparency) {
	//C:\\Program Files\\Adobe\\Adobe After Effects 2020\\Support Files
	// const files = await imagemin(['C:/Users/tropi/AppData/Roaming/Adobe/CEP/extensions/bodymovin/server/images/*.{jpg,png}'], {
	const destinationPathFolder = path.substr(0, path.lastIndexOf('/') + 1);
	const destinationFullPath = destinationPathFolder;
	const plugins = []
	if (hasTransparency) {
		plugins.push(imageminPngquant({
			quality: [0, compression]
		}))
	} else {
		/*plugins.push(imageminJpegoptim({
			// max: Math.round(compression * 100)
			max: compression
		}))*/
		plugins.push(pngToJpeg({quality: Math.round(compression * 100)}))
	}
	const files = await imagemin([path], {
	// const files = await imagemin(['./images/hernan.jpg'], {
			destination: destinationFullPath,
			plugins
		});

		return files
		// return files
		//=> [{data: <Buffer 89 50 4e …>, destinationPath: 'build/images/foo.jpg'}, …]
}

const app = express.createServer();
app.use(bodyParser.json())
const port = 3119

app.get('/', (req, res) => {

	res.send('Root')
})

function checkImageTransparency(imagePath) {
	return new Promise((resolve, reject) => {
		try {
			const stream = fs.createReadStream(imagePath)
			stream.on('error', function(error) {
				reject(error)
			})
			const pngStream = stream.pipe(new PNG())

			pngStream.on('metadata', function(meta) {
				// console.log('meta.alpha', meta.alpha)
				// resolve(meta.alpha + 'testtt')
			})

			pngStream.on('parsed', function() {
				var hasTransparency = false
				for (var y = 0; y < this.height; y++) {
					for (var x = 0; x < this.width; x++) {
						var idx = (this.width * y + x) << 2;
						if (this.data[idx+3] !== 255) {
							hasTransparency = true
							x = this.width
							y = this.height
						}
					}
				}
				resolve(hasTransparency)
			})

		} catch(err)
		{
			reject(err)
		}
	})
}

app.post('/encode', async function(req, res){
	if (req.body.path) {
		const fs = require('fs');
		const decodedPath = decodeURIComponent(req.body.path)

		const buff = fs.readFileSync(decodedPath);
		const base64data = buff.toString('base64');
		res.send({
			status: 'success',
			data: base64data,
		})
	} else {
		res.send({
			status: 'error',
			message: 'missing params',
		})
	}
})

app.post('/processImage/', async function(req, res){
	if (req.body.path && req.body.compression) {
		try {
			const decodedPath = decodeURIComponent(req.body.path)
			const hasTransparency = await checkImageTransparency(decodedPath)
			const processedImages  = await processImage(decodedPath, req.body.compression, hasTransparency)
			if (!hasTransparency) {
				var renamedPath = decodedPath.substr(0, decodedPath.lastIndexOf('.png')) + '.jpg'
				fs.renameSync(decodedPath, renamedPath)
			}
			if (processedImages.length) {
				res.send({
					status: 'success',
					path: processedImages[0].destinationPath,
					extension: hasTransparency ? 'png' : 'jpg',
				})
			} else {
				res.send({
					status: 'error',
					message: 'Could not export',
				})
			}
		} catch(error) {
			res.send({
				status: 'error',
				err: error,
				message: error.message,
			});
		}
	} else {
		res.send({
			status: 'error',
			message: 'missing params',
		});
	}
});

app.post('/convertToFlare/', async function(req, res){
	if (req.body.animation) {
		try {
			const result = await ltf.convert(req.body.animation)
			res.send({
				status: 'success',
				payload: result,
			});
		} catch(error) {
			res.send({
				status: 'error',
				message: error.message,
				error: error
			});
		}
	} else {
		res.send({
			status: 'error',
			message: 'missing params',
		});
	}
});



////  TESTING ULRS

app.get('/encode', async function(req, res){
	const fs = require('fs');

	let buff = fs.readFileSync('images/img_0_test.png');
	let base64data = buff.toString('base64');
	res.send({
		status: 'success',
		data: base64data,
	})
})

app.get('/process', async function(req, res){
	try {
		const hasTransparency = await checkImageTransparency('images/img_0_test.png')
		const processedImages  = await processImage(decodeURIComponent(req.body.path), req.body.compression, hasTransparency)
		if (processedImages.length) {
			res.send({
				status: 'success',
				path: processedImages[0].destinationPath,
			})
		} else {
			res.send({
				status: 'error',
				message: 'Could not export',
			})
		}
	} catch(error) {
		res.send({
			status: 'error',
			err: error,
			message: error.message,
		});
	}

});


////  END TESTING ULRS

app.listen(port)