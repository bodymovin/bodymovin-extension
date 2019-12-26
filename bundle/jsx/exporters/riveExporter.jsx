/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global File, Folder, $*/

$.__bodymovin.bm_riveExporter = (function () {

	var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_fileManager = $.__bodymovin.bm_fileManager;
    var exporterHelpers = $.__bodymovin.bm_exporterHelpers;

	var ob = {}
	var _callback;

    function saveSuccess() {
        _callback(exporterHelpers.exportTypes.RIVE, exporterHelpers.exportStatuses.SUCCESS);
    }

    function saveFailed() {
        _callback(exporterHelpers.exportTypes.RIVE, exporterHelpers.exportStatuses.FAILED);
    }

	function save(destinationPath, config, callback) {
		_callback = callback;

		if (config.export_modes.rive) {

			var originalDestinationFile = new File(destinationPath);
			var destinationFileName = originalDestinationFile.name;
	        var destinationFileNameWithoutExtension = destinationFileName.substr(0, destinationFileName.lastIndexOf('.'));
			var destinationFolder = new Folder(originalDestinationFile.parent);
			destinationFolder.changePath('rive');
			if (!destinationFolder.exists) {
				destinationFolder.create();
			}

			var riveDestinationFileName = new File(destinationFolder.fsName)
			riveDestinationFileName.changePath(destinationFileNameWithoutExtension + '.rive')

			var rawFiles = bm_fileManager.getFilesOnPath(['raw']);

			var animationStringData = exporterHelpers.getJsonData(rawFiles);
			bm_eventDispatcher.sendEvent('bm:create:rive', {animation: animationStringData, destination: riveDestinationFileName.fsName});
		
		} else {
			_callback(exporterHelpers.exportTypes.RIVE, exporterHelpers.exportStatuses.SUCCESS);
		}
	}


	ob.save = save;
    ob.saveSuccess = saveSuccess;
    ob.saveFailed = saveFailed;
    
    return ob;
}());