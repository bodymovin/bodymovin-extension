/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_solidLayerReport = (function () {
    
    var layerReport = $.__bodymovin.bm_layerReport;
    var MessageClass = $.__bodymovin.bm_messageClassReport;
    var generalUtils = $.__bodymovin.bm_generalUtils;

    function SolidLayer(layer) {
        this.layer = layer;
        this.process();
    }
    
    generalUtils.extendPrototype(SolidLayer, MessageClass);

    SolidLayer.prototype.processLayer = function() {
        this.layerReport = layerReport(this.layer);
    }

    SolidLayer.prototype.process = function() {
        this.processLayer();
    }

    SolidLayer.prototype.serialize = function() {
        var layerReportData = this.layerReport.serialize();
        var localMessages = this.serializeMessages();
        return {
            messages: localMessages.concat(layerReportData.messages),
            transform: layerReportData.transform,
        }
    }



    return function(layer) {
        return new SolidLayer(layer);
    }
    
}());