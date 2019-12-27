/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global File, Folder, $*/

$.__bodymovin.bm_lottieImporter = (function () {

	var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
 	// var bm_fileManager = $.__bodymovin.bm_fileManager;
    var JSON = $.__bodymovin.JSON;

	var ob = {};

	function createFolder(name) {

	}

	function importLottie(lottie) {
		bm_eventDispatcher.log("ASSETS: " + lottie.assets.length)
	}

	function loadFileFromPath(path) {
		bm_eventDispatcher.log("PASO 1: ");
		bm_eventDispatcher.log(path);
		var lottieFile = new File(decodeURIComponent(path));
		if (lottieFile.exists) {
			bm_eventDispatcher.log("PASO 2:EXISTS: ");
			lottieFile.open('r');
			bm_eventDispatcher.log("PASO 3:EXISTS: ");
			var lottieString = lottieFile.read();
			bm_eventDispatcher.log("PASO 4:EXISTS: ");
			lottieFile.close();
			bm_eventDispatcher.log("PASO 5:EXISTS: ");
			bm_eventDispatcher.log("PASO 6:EXISTS: ");

		} else {
			throw new Error('File does not exist')
		}

	}

	function importFromPath(path) {
		try {
			loadFileFromPath(path)
			// var lottieFile = new File(decodeURIComponent(path))
			// bm_eventDispatcher.log("PASO 2: ")
			// lottieFile.open('r');
			// bm_eventDispatcher.log("PASO 3: ")
			// var lottieString = lottieFile.read();
			// bm_eventDispatcher.log("PASO 4: ")
			// lottieFile.close();
			// bm_eventDispatcher.log("PASO 5: ")
			// importLottie(JSON.parse(lottieString))
			// bm_eventDispatcher.log("PASO 6: ")

		} catch(err) {
            bm_eventDispatcher.sendEvent('bm:alert', {message: 'Could not import lottie file'});
		}
	}


	ob.importLottie = importLottie;
	ob.importFromPath = importFromPath;
    
    return ob;
}());