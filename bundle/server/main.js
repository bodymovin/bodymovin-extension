const imagemin = require('imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
// const imageminJpegoptim = require('imagemin-jpegoptim');
const imageminPngquant = require('imagemin-pngquant');
const pngToJpeg = require('png-to-jpeg');
const express = require('express')
var fs = require('fs');
var nodePath = require('path');
var bodyParser = require('body-parser');
var PNG = require('pngjs').PNG;
var LottieToFlare = require('./lottie_to_flare/test.bundle.js').default
var animationSegmenter = require('./animationSegmenter')
const FileType = require('file-type');
const os = require('os');
var ltf = new LottieToFlare();

var JSZip = require('jszip');

let localStoredId = ''

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
app.use(express.static('public'))
app.use(function (req, res, next) {
	if (!req.headers || !req.headers['bodymovin-id']) {
		res.status(403).send('Client unauthorized');
	} else {
		// TODO: improve this
		next();
		// const bodymovinId = req.headers['bodymovin-id'];
		// // Because of race conditions if values don't match it will try one more time to get it from the local file system
		// if (bodymovinId !== localStoredId) {
		// 	localStoredId = fs.readFileSync(os.tmpdir() + nodePath.sep + 'bodymovin_uid.txt', "utf8");
		// }
		// // if values still don't match, reject the request
		// if (bodymovinId !== localStoredId) {
		// 	res.status(403).send('Client unauthorized');
		// } else {
		// 	next();
		// }
	}
  })
const port = 24801

app.get('/', (req, res) => {

	res.send('Root 1')
	// res.send(nodePath.join(__dirname, 'public') + nodePath.sep + 'canvaskit.wasm')
})

app.get('/canvaskit.wasm', (req, res) => {
	const filePath = nodePath.join(__dirname, 'public') + nodePath.sep + 'canvaskit.wasm'
	const buffer = fs.readFileSync(filePath)
	if (buffer) {
		res.setHeader('Content-Type', 'application/wasm');
		res.send(buffer);
	} else {
		res.send('NOT FOUND')
	}
})

app.get('/canvaskit.js', (req, res) => {
	const filePath = nodePath.join(__dirname, 'public') + nodePath.sep + 'canvaskit.js'
	const buffer = fs.readFileSync(filePath)
	if (buffer) {
		res.setHeader('Content-Type', 'text/javascript; charset=UTF-8');
		res.send(buffer);
	} else {
		res.send('NOT FOUND')
	}
})

app.get('/fileFromPath', (req, res) => {
	const filePath = req.query.path
	const buffer = fs.readFileSync(filePath)
	if (buffer) {
		res.setHeader('Content-Type', decodeURIComponent(req.query.type));
		res.send(buffer);
	} else {
		res.send('NOT FOUND')
	}
	res.send(JSON.stringify(req.query))
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
		try {
			const fs = require('fs');
			const decodedPath = decodeURIComponent(req.body.path)

			const buff = fs.readFileSync(decodedPath);
			const base64data = buff.toString('base64');
			res.send({
				status: 'success',
				data: base64data,
			})
		} catch(err) {
			res.send({
			status: 'error',
			message: 'failed decoding',
			error: err,
			errorMessage: err.message,
		})
		}
	} else {
		res.send({
			status: 'error',
			message: 'missing params',
		})
	}
})

app.post('/getType', async function(req, res){
	if (req.body.path) {
		try {
			const fileType = await FileType.fromFile(decodeURIComponent(req.body.path))
			res.send({
				status: 'success',
				fileType: fileType,
			})
		} catch(err) {
			res.send({
			status: 'error',
			message: 'failed getting type',
			error: err,
			errorMessage: err.message,
		})
		}
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

app.post('/createBanner/', async function(req, res){
	if (req.body.origin && req.body.destination) {
		try {

			const zip = JSZip();

			const traverseDirToZip = async(absolutePath, relativePath = '') => {
				const dirItems = await readdir(absolutePath + relativePath);
				await Promise.all(dirItems.map(async item => {
					const fileRelativePath = relativePath + nodePath.sep + item;
					if (fs.lstatSync(absolutePath + fileRelativePath).isDirectory()) {
						await traverseDirToZip(absolutePath, fileRelativePath)
					} else {
						const fileData = await getFile(absolutePath + fileRelativePath)
						zip.file(fileRelativePath.substr(1), fileData);
					}
				}))
				return 'ENDED'
			}

			const originFolder = decodeURIComponent(req.body.origin);
			const destinationFolderFile = decodeURIComponent(req.body.destination);


			await traverseDirToZip(originFolder);

			const zipBlob = await zip.generateAsync({type: 'nodebuffer', compression: "DEFLATE"})

			fs.writeFile(destinationFolderFile, zipBlob, 'binary', (error, success) => {
				res.send({
					status: 'success',
				});
			});
		} catch(error) {
			res.send({
				status: 'error',
				error: error,
				message: error ? error.message || 'No message but error' : 'No Error',
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
	if (req.body.origin && req.body.destination && req.body.fileName) {
		try {
			// const originPath = "C:\\Users\\tropi\\AppData\\Local\\Temp\\Bodymovin\\gwir6aia7c\\rive";
			// const destinationPath = "C:\\Users\\tropi\\AppData\\Local\\Temp\\Bodymovin\\gwir6aia7c\\riveExport";
			// var destinationName = 'flare.flr2d';
			const originPath = decodeURIComponent(req.body.origin);
			const destinationPath = decodeURIComponent(req.body.destination);
			var destinationName = decodeURIComponent(req.body.fileName);

			const zip = JSZip();

			const dirItems = await readdir(originPath);
			const jsonFilePath = await getJsonPath(dirItems, originPath);

			const jsonDataString = await getJsonData(jsonFilePath)
			const result = await ltf.convert(jsonDataString);
			zip.file(destinationName, JSON.stringify(result));

			// Adding assets
			const jsonData = JSON.parse(jsonDataString)
			const lottieAssets = jsonData.assets
				.filter(asset => !!asset.p)

			const assetsData = await Promise.all(lottieAssets.map(asset => {
				return getFile(originPath + nodePath.sep + asset.u + asset.p)
			}))
			lottieAssets.forEach((asset, index) => {
				zip.file(asset.id, assetsData[index]);
			})

			const zipBlob = await zip.generateAsync({type: 'nodebuffer'})

			fs.writeFile(destinationPath + nodePath.sep + destinationName, zipBlob, 'binary', (error, success) => {
				console.log(error, success)
			});
			

			res.send({
				status: 'success',
			});
		} catch(error) {
			res.send({
				status: 'error',
				error: error,
				message: error ? error.message || 'No message but error' : 'No Error',
			});
		}
	} else {
		res.send({
			status: 'error',
			message: 'missing params',
		});
	}
});

app.post('/splitAnimation/', async function(req, res){
	if (req.body.origin && req.body.destination && req.body.fileName && req.body.time) {
		try {
			const origin = decodeURIComponent(req.body.origin);
			const destination = decodeURIComponent(req.body.destination);
			const fileName = decodeURIComponent(req.body.fileName);
			const time = req.body.time;

			const jsonData = await getJsonData(origin + nodePath.sep + fileName + '.json')
			const jsonObject = JSON.parse(jsonData);
			const animationPieces = await animationSegmenter(jsonObject, time)

			await writeFile(destination + nodePath.sep + fileName + '.json', JSON.stringify(animationPieces.main))
			await Promise.all(animationPieces.segments.map((segment, index) => {
				return writeFile(destination + nodePath.sep + fileName  + '_' + index + '.json', JSON.stringify(segment))
			}))


			res.send({
				status: 'success',
				totalSegments: animationPieces.segments.length
			});
		} catch(error) {
			res.send({
				status: 'error',
				error: error,
				message: error ? error.message || 'No message but error' : 'No Error',
			});
		}
	} else {
		res.send({
			status: 'error',
			message: 'missing params',
		});
	}
});

app.get('/ping', function(req, res){
	res.send('pong')
})


// Helpers

function readdir(path) {
	return new Promise((resolve, reject) => {
		fs.readdir(path, function(err, items) {
			if (!err && items) {
				resolve(items)
			} else {
				reject('No Items')
			}
		});
	})
}

function getJsonPath(items, originPath) {
	return new Promise((resolve, reject) => {
		let jsonFilePath = '';
		for (var i=0; i<items.length; i++) {
			if (items[i].indexOf('.json') !== -1) {
				jsonFilePath = originPath + nodePath.sep + items[i];
				break;
			}
		}
		if (jsonFilePath) {
			resolve(jsonFilePath)
		} else {
			reject('No json Path');
		}
	})
}

function getJsonData(path) {
	return new Promise((resolve, reject) => {
		const jsonData = fs.readFileSync(path, "utf8");
		if (jsonData) {
			resolve(jsonData)
		} else {
			reject('Failed getting Json')
		}
	})
}

function getFile(path, encoding = '') {
	return new Promise((resolve, reject) => {
		const fileData = fs.readFileSync(path, encoding);
		if (fileData) {
			resolve(fileData)
		} else {
			reject('Failed getting File: ' + path)
		}
	})
}

function writeFile(path, content, encoding = 'utf8') {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, content, 'utf8', (error, success) => {
			if (error) {
				reject(error)
			} else {
				resolve(success)
			}
		});
	})
}

////  TESTING ULRS

////  END TESTING ULRS
app.listen(port, '127.0.0.1');