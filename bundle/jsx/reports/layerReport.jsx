/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_layerReport = (function () {
    
    var MessageClass = $.__bodymovin.bm_messageClassReport;
    var generalUtils = $.__bodymovin.bm_generalUtils;
    var transformFactory = $.__bodymovin.bm_transformReportFactory;

    function Layer(layer) {
        this.layer = layer;
        this.process();
    }

    generalUtils.extendPrototype(Layer, MessageClass);

    Layer.prototype.process = function() {
        this.processTransform();
    }

    Layer.prototype.processTransform = function() {
        this.transform = transformFactory(this.layer.transform, this.layer.threeDLayer);
    }

    Layer.prototype.serialize = function() {
    	return {
            messages: this.serializeMessages(),
            transform: this.transform.serialize(),
        }
    }


    return function(layer) {
    	return new Layer(layer);
    }
    
}());