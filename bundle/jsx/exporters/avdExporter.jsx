/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global File, Folder, $*/

$.__bodymovin.bm_avdExporter = (function () {

	var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_fileManager = $.__bodymovin.bm_fileManager;
    var exporterHelpers = $.__bodymovin.bm_exporterHelpers;

	var ob = {};
	var _callback;

    function saveAVDDataSuccess() {
        _callback(exporterHelpers.exportTypes.AVD, exporterHelpers.exportStatuses.SUCCESS);
    }

    function saveAVDFailed() {
        _callback(exporterHelpers.exportTypes.AVD, exporterHelpers.exportStatuses.FAILED);
    }

	function save(destinationPath, config, callback) {
		_callback = callback;

		if (config.export_modes.avd) {

			var originalDestinationFile = new File(destinationPath);
			var destinationFileName = originalDestinationFile.name;
	        var destinationFileNameWithoutExtension = destinationFileName.substr(0, destinationFileName.lastIndexOf('.'));
			var avdDestinationFolder = new Folder(originalDestinationFile.parent);
			avdDestinationFolder.changePath('avd');
			if (!avdDestinationFolder.exists) {
				avdDestinationFolder.create();
			}

			var avdDestinationFileName = new File(avdDestinationFolder.fsName)
			avdDestinationFileName.changePath(destinationFileNameWithoutExtension + '.xml')

			var rawFiles = bm_fileManager.getFilesOnPath(['raw']);

			var animationStringData = exporterHelpers.getJsonData(rawFiles);
			bm_eventDispatcher.sendEvent('bm:create:avd', {animation: animationStringData, destination: avdDestinationFileName.fsName});
		
		} else {
			_callback(exporterHelpers.exportTypes.AVD, exporterHelpers.exportStatuses.SUCCESS);
		}
	}


	ob.save = save;
    ob.saveAVDDataSuccess = saveAVDDataSuccess;
    ob.saveAVDFailed = saveAVDFailed;
    
    return ob;
}());