/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_layerReport = (function () {
    
    var ob;
    var getLayerType = $.__bodymovin.getLayerType;
    var layerTypes = $.__bodymovin.layerTypes;
    var solidLayerReport = $.__bodymovin.bm_solidLayerReport;

    function createSolidReport(layer) {
    	return solidLayerReport(layer);
    }

    function processLayer(layer) {
        
        var layerType = getLayerType(layer);
        if (layerType === layerTypes.solid) {
        	return createSolidReport(layer);
        }
    }


    ob = {
        processLayer: processLayer,
    };
    
    return ob;
}());