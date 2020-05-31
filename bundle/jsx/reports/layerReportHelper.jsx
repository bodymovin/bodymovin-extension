/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_layerReportHelper = (function () {
    
    var ob;
    var getLayerType = $.__bodymovin.getLayerType;
    var layerTypes = $.__bodymovin.layerTypes;
    var solidLayerReport = $.__bodymovin.bm_solidLayerReport;
    var compositionLayerReport = $.__bodymovin.bm_compositionLayerReport;
    var unhandledLayerReport = $.__bodymovin.bm_unhandledLayerReport;

    function createSolidReport(layer) {
        return solidLayerReport(layer);
    }

    function createCompositionReport(layer) {
        return compositionLayerReport(layer);
    }

    function createUnhandledLayerReport(layer) {
    	return unhandledLayerReport(layer);
    }

    function processLayer(layer) {
        
        var layerType = getLayerType(layer);
        if (layerType === layerTypes.solid) {
            return createSolidReport(layer);
        } else if (layerType === layerTypes.precomp) {
            return createCompositionReport(layer);
        } else {
            return createUnhandledLayerReport(layer);
        }
    }


    ob = {
        processLayer: processLayer,
    };
    
    return ob;
}());