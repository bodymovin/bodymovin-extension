/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global File, Folder, $*/

$.__bodymovin.bm_demoExporter = (function () {

	var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_downloadManager = $.__bodymovin.bm_downloadManager;
    var bm_fileManager = $.__bodymovin.bm_fileManager;
    var JSON = $.__bodymovin.JSON;
	var ob = {}

	function getJsonData(rawFiles) {
		var i = 0, len = rawFiles.length;
		while(i < len) {
			if(rawFiles[i].name.indexOf('.json') !== -1) {
				break;
			}
			i += 1;
		}
		var fileData = bm_fileManager.getFileById(rawFiles[i].id);
		var jsonFile = fileData.file;
		jsonFile.open('r');
		var content = jsonFile.read();
		jsonFile.close();
		return content;
	}

	function saveAssets(rawFiles, destinationFolder) {
		var i = 0, len = rawFiles.length;
		// TODO improve this solution
		while(i < len) {
			if(rawFiles[i].name.indexOf('.json') === -1) {
				var fileData = bm_fileManager.getFileById(rawFiles[i].id);
				if (fileData) {
					var file = fileData.file;
					if (file.exists) {
						var destinationFileFolder = new Folder(destinationFolder.fsName);
						// TODO improve this solution
						destinationFileFolder.changePath('images');
						if (!destinationFileFolder.exists) {
							destinationFileFolder.create();
						}
						var destinationFile = new File(destinationFileFolder.fsName);
						destinationFile.changePath(file.name);
						if (!file.copy(destinationFile.fsName)) {
							bm_eventDispatcher.log('COPY FAILED')
						}
					}
				}
			}
			i += 1;
		}
	}

	function save(destinationPath) {

		var destinationFile = new File(destinationPath);
		var demoDestinationFolder = new Folder(destinationFile.parent);
		demoDestinationFolder.changePath('demo');
		if (!demoDestinationFolder.exists) {
			demoDestinationFolder.create();
		}

		var rawFiles = bm_fileManager.getFilesOnPath(['raw']);

		saveAssets(rawFiles, demoDestinationFolder)

        // var fullFilePathName = destinationPath.substr(destinationPath.lastIndexOf('/') + 1);

		var animationStringData = getJsonData(rawFiles);
		var data = JSON.parse(animationStringData);

		var demoStr = bm_downloadManager.getDemoData();
		// var animationStringData = JSON.stringify(data);
		demoStr = demoStr.replace('"__[[ANIMATIONDATA]]__"', "" + animationStringData + "");
		if(data.ddd) {
		    demoStr = demoStr.replace('__[[RENDERER]]__', "html");
		} else {
		    demoStr = demoStr.replace('__[[RENDERER]]__', "svg");
		}

		var demoDestinationFile = new File(demoDestinationFolder.fsName);
		demoDestinationFile.changePath('index.html');
		demoDestinationFile.open('w', 'TEXT', '????');
		demoDestinationFile.encoding = 'UTF-8';
		try {
		    demoDestinationFile.write(demoStr); //DO NOT ERASE, JSON UNFORMATTED
		    //dataFile.write(JSON.stringify(ob.renderData.exportData, null, '  ')); //DO NOT ERASE, JSON FORMATTED
		    demoDestinationFile.close();
		} catch (errr) {
		    bm_eventDispatcher.sendEvent('bm:alert', {message: 'Could not write file.<br /> Make sure you have enabled scripts to write files. <br /> Edit > Preferences > General > Allow Scripts to Write Files and Access Network '});
		}
	}

	ob.save = save;
    
    return ob;
}());