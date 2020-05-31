/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_unhandledLayerReport = (function () {
    
    var layerReport = $.__bodymovin.bm_layerReport;
    var MessageClass = $.__bodymovin.bm_messageClassReport;
    var generalUtils = $.__bodymovin.bm_generalUtils;
    var rendererTypes = $.__bodymovin.bm_reportRendererTypes;
    var builderTypes = $.__bodymovin.bm_reportBuilderTypes;
    var messageTypes = $.__bodymovin.bm_reportMessageTypes;

    function UnhandledLayer(layer) {
        this.layer = layer;
        this.process();
    }

    generalUtils.extendPrototype(UnhandledLayer, MessageClass);

    UnhandledLayer.prototype.processLayer = function() {
        this.layerReport = layerReport(this.layer);
    }

    UnhandledLayer.prototype.processData = function() {
        this.addMessage(messageTypes.WARNING,
        [
            rendererTypes.WEB,
            rendererTypes.SKOTTIE,
            rendererTypes.IOS,
            rendererTypes.ANDROID,
        ],
        builderTypes.UNHANDLED_LAYER);
    }

    UnhandledLayer.prototype.process = function() {
        this.processData();
        this.processLayer();
    }

    UnhandledLayer.prototype.serialize = function() {
        var layerReportData = this.layerReport.serialize();
        var localMessages = this.serializeMessages();
        return {
            messages: localMessages.concat(layerReportData.messages),
            transform: layerReportData.transform,
        }
    }



    return function(layer) {
        return new UnhandledLayer(layer);
    }
    
}());