/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global bm_eventDispatcher, bm_generalUtils, bm_downloadManager, File, $*/

$.__bodymovin.bm_standardExporter = (function () {

	var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
	var ob = {}

	function save(data, destinationPath, config, callback) {
		bm_eventDispatcher.log('SAVING STANDARD')
	}

	ob.save = save;
    
    return ob;
}());