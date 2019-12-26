/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global File, Folder, $*/

$.__bodymovin.bm_demoExporter = (function () {

    var bm_downloadManager = $.__bodymovin.bm_downloadManager;
    var exporterHelpers = $.__bodymovin.bm_exporterHelpers;
    var bm_fileManager = $.__bodymovin.bm_fileManager;
    var JSON = $.__bodymovin.JSON;
	var ob = {}
	var _callback;

	function save(destinationPath, config, callback) {

		_callback = callback;

		if (config.export_modes.banner) {

			var destinationFile = new File(destinationPath);
			var demoDestinationFolder = new Folder(destinationFile.parent);
			demoDestinationFolder.changePath('demo');
			if (!demoDestinationFolder.exists) {
				demoDestinationFolder.create();
			}

			var rawFiles = bm_fileManager.getFilesOnPath(['raw']);

			exporterHelpers.saveAssets(rawFiles, demoDestinationFolder)

	        // var fullFilePathName = destinationPath.substr(destinationPath.lastIndexOf('/') + 1);

			var animationStringData = exporterHelpers.getJsonData(rawFiles);
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
			    _callback(exporterHelpers.exportTypes.DEMO, exporterHelpers.exportStatuses.SUCCESS);
			} catch (errr) {
			    _callback(exporterHelpers.exportTypes.DEMO, exporterHelpers.exportStatuses.FAILED);
			}
		} else {
			_callback(exporterHelpers.exportTypes.DEMO, exporterHelpers.exportStatuses.SUCCESS);
		}
	}

	ob.save = save;
    
    return ob;
}());