/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global bm_eventDispatcher, bm_generalUtils, bm_downloadManager, File, Folder, $*/

$.__bodymovin.bm_bannerExporter = (function () {

	var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
	var bm_downloadManager = $.__bodymovin.bm_downloadManager;
	var bm_projectManager;
    var JSON = $.__bodymovin.JSON;
	var ob = {};
	var lottiePaths = []

	function getLottiePath(bannerConfig) {
		var sourcePath = '';
		if (bannerConfig.lottie_origin === 'local' || bannerConfig.lottie_origin === 'cdnjs') {
			var i = 0, len = lottiePaths.length;
			while ( i < len) {
				if(lottiePaths[i].value === bannerConfig.lottie_library) {
					sourcePath = lottiePaths[i][bannerConfig.lottie_origin];
				}
				i += 1;
			}
		} else {
			sourcePath = bannerConfig.lottie_path
		}
		return sourcePath;
	}

	function getSizes(bannerConfig) {
		return {
			width: bannerConfig.use_original_sizes ? bannerConfig.original_width : bannerConfig.width,
			height: bannerConfig.use_original_sizes ? bannerConfig.original_height : bannerConfig.height,
		}
	}

	function createTemplate(config, filePathName, savingFolder) {
		var bannerConfig = config.banner
		var templateData = bm_downloadManager.getTemplateData()
		var sizes = getSizes(bannerConfig)

		templateData = templateData
		.replace(/__CONTENT_WIDTH__/g, sizes.width)
		.replace(/__CONTENT_HEIGHT__/g, sizes.height)
		.replace(/__LOTTIE_RENDERER__/g, bannerConfig.lottie_renderer)
		.replace(/__CLICK_TAG__/g, bannerConfig.click_tag)
		.replace(/__LOTTIE_SOURCE__/g, getLottiePath(bannerConfig))
		.replace(/__FILE_PATH__/g, filePathName)

		var dataFile = new File(savingFolder.fullName + '/index.html');
		dataFile.open('w', 'TEXT', '????');
		dataFile.encoding = 'UTF-8';
		dataFile.write(templateData);
		dataFile.close();

	}

	function includeAdditionalFiles(config, savingFolder) {
		if (!bm_projectManager) {
			bm_projectManager = $.__bodymovin.bm_projectManager;
		}
		var bannerConfig = config.banner
		if (bannerConfig.lottie_origin === 'local') {
			var i = 0, len = lottiePaths.length, sourcePath;
			while ( i < len) {
				if(lottiePaths[i].value === bannerConfig.lottie_library) {
					sourcePath = lottiePaths[i][bannerConfig.lottie_origin];
				}
				i += 1;
			}
			// var file = bm_projectManager.getFile('/assets/player/lottie.js')
			var file = bm_projectManager.getFile('/assets/player/' + sourcePath)


			/*var i = 0, len = lottiePaths.length;
			while ( i < len) {
				if(lottiePaths[i].value === bannerConfig.lottie_library) {
					sourcePath = lottiePaths[i][bannerConfig.lottie_origin];
				}
				i += 1;
			}*/

			var dataFile = new File(savingFolder.fullName + '/' + sourcePath);
			
			file.copy( dataFile )
		}
	}

	function save(stringData, destinationPath, config, callback) {

		var bannerConfig = config.banner
		var savingFolder
		var destinationPathFolder = destinationPath.substr(0, destinationPath.lastIndexOf('/') + 1);
		var destinationFolder = new Folder(destinationPathFolder)
		if (bannerConfig.zip_files) {
			var tempFolderName = 'tmp_' + Math.random().toString().substr(2)
			savingFolder = new Folder(Folder.temp.path + '/LottieTemp/' + tempFolderName)
		} else {
			savingFolder = destinationFolder
		}

		if (savingFolder.exists || savingFolder.create()) {

			var filePathName = destinationPath.substr(destinationPath.lastIndexOf('/') + 1);
			var jsonPathName = filePathName
			if (bannerConfig.zip_files) {
				jsonPathName = jsonPathName.replace('.zip', '.json')
			}

			createTemplate(config, jsonPathName, savingFolder)
			includeAdditionalFiles(config, savingFolder)
			var dataFile = new File(savingFolder.fullName + '/' + jsonPathName);
			dataFile.open('w', 'TEXT', '????');
			dataFile.encoding = 'UTF-8';
			dataFile.write(stringData);
			dataFile.close();

			
			if (bannerConfig.zip_files) {
				bm_eventDispatcher.sendEvent('bm:zip:banner', {destinationPath: destinationFolder.fsName + '/' + filePathName, folderPath: savingFolder.fsName});
			}
			
		}
		callback();
	}

	function setLottiePaths(paths) {
		lottiePaths = paths
	}

	ob.save = save;
	ob.setLottiePaths = setLottiePaths
    
    return ob;
}());