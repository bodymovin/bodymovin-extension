/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global bm_eventDispatcher, bm_generalUtils, bm_downloadManager, File, Folder, $*/

$.__bodymovin.bm_flareExporter = (function () {

	var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
	var bm_downloadManager = $.__bodymovin.bm_downloadManager;

	var ob = {}

	function save(stringData, destinationPath, config, callback) {

		callback();
	}


	ob.save = save;
    
    return ob;
}());