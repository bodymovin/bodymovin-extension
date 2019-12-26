/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global File, Folder, $*/

$.__bodymovin.bm_standaloneExporter = (function () {

	var bm_fileManager = $.__bodymovin.bm_fileManager;
	var exporterHelpers = $.__bodymovin.bm_exporterHelpers;
	var bm_downloadManager = $.__bodymovin.bm_downloadManager;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
	var _callback;
	var ob = {}

	function save(destinationPath, config, callback) {
		_callback = callback;

		if (config.export_modes.standalone) {
			var originalDestinationFile = new File(destinationPath);
			var destinationFileName = originalDestinationFile.name;
	        var destinationFileNameWithoutExtension = destinationFileName.substr(0, destinationFileName.lastIndexOf('.'));
			var standaloneDestinationFolder = new Folder(originalDestinationFile.parent);
			standaloneDestinationFolder.changePath('standalone');
			if (!standaloneDestinationFolder.exists) {
				standaloneDestinationFolder.create();
			}
			var destinationFile = new File(standaloneDestinationFolder.fsName);
			destinationFile.changePath(destinationFileNameWithoutExtension + '.js');

			var rawFiles = bm_fileManager.getFilesOnPath(['raw']);
			var animationStringData = exporterHelpers.getJsonData(rawFiles);

		    var bodymovinJsStr = bm_downloadManager.getStandaloneData();
		    animationStringData = bodymovinJsStr.replace("\"__[ANIMATIONDATA]__\"",  animationStringData );
		    animationStringData = animationStringData.replace("\"__[STANDALONE]__\"", 'true');

			destinationFile.open('w', 'TEXT', '????');
			destinationFile.encoding = 'UTF-8';
			try {
			    destinationFile.write(animationStringData); //DO NOT ERASE, JSON UNFORMATTED
			    //destinationFile.write(JSON.stringify(ob.renderData.exportData, null, '  ')); //DO NOT ERASE, JSON FORMATTED
			    destinationFile.close();
			    _callback(exporterHelpers.exportTypes.STANDALONE, exporterHelpers.exportStatuses.SUCCESS);
			} catch (err) {
				_callback(exporterHelpers.exportTypes.STANDALONE, exporterHelpers.exportStatuses.FAILED);
			}
			exporterHelpers.saveAssets(rawFiles, standaloneDestinationFolder);
		} else {
			_callback(exporterHelpers.exportTypes.STANDALONE, exporterHelpers.exportStatuses.SUCCESS);
		}
	}


	ob.save = save;
    
    return ob;
}());