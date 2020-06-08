/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_layerReportHelper = (function () {
    
    var ob;
    var getLayerType = $.__bodymovin.getLayerType;
    var layerTypes = $.__bodymovin.layerTypes;
    var solidLayerReport = $.__bodymovin.bm_solidLayerReport;
    var compositionLayerReport = $.__bodymovin.bm_compositionLayerReport;
    var shapeLayerReport = $.__bodymovin.bm_shapeLayerReport;
    var textLayerReport = $.__bodymovin.bm_textLayerReport;
    var unhandledLayerReport = $.__bodymovin.bm_unhandledLayerReport;

    function createSolidReport(layer, onComplete, onFail) {
        return solidLayerReport(layer, onComplete, onFail);
    }

    function createCompositionReport(layer, onComplete, onFail) {
        return compositionLayerReport(layer, onComplete, onFail);
    }

    function createShapeReport(layer, onComplete, onFail) {
        return shapeLayerReport(layer, onComplete, onFail);
    }

    function createTextLayerReport(layer, onComplete, onFail) {
        return textLayerReport(layer, onComplete, onFail);
    }

    function createUnhandledLayerReport(layer, onComplete, onFail) {
    	return unhandledLayerReport(layer, onComplete, onFail);
    }

    function createLayer(layer, onComplete, onFail) {
        
        var layerType = getLayerType(layer);
        if (layerType === layerTypes.solid) {
            return createSolidReport(layer, onComplete, onFail);
        } else if (layerType === layerTypes.precomp) {
            return createCompositionReport(layer, onComplete, onFail);
        } else if (layerType === layerTypes.shape) {
            return createShapeReport(layer, onComplete, onFail);
        } else if (layerType === layerTypes.text) {
            return createTextLayerReport(layer, onComplete, onFail);
        } else {
            return createUnhandledLayerReport(layer, onComplete, onFail);
        }
    }


    ob = {
        createLayer: createLayer,
    };
    
    return ob;
}());