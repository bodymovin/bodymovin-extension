var Jimp = require('jimp/index.js');

var jimp_bridge = (function(){
	function convert(path){
		Jimp.read(path).then(function (image) {
			console.log('success')
			image.quality(60)
			.write(path.replace('png','jpg'));
		    // do stuff with the image 
		}).catch(function (err) {
			console.log(err);
		    // handle an exception 
		});
	}


	return {
		convert: convert
	}
}())