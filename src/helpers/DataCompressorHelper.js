var zlib = require('zlib');

function compressData(data) {
  let path = data.path
  let message = data.message

  var input = new Buffer(message, 'utf8')
	return new Promise(function(res, rej) {
		zlib.gzip(input, {level: zlib.Z_BEST_COMPRESSION}, function(err, buf) {
			res({path: path, buf: buf})
		})
  });
}

export default compressData
