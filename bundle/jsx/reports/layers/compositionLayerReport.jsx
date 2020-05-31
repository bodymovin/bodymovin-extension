/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_compositionLayerReport = (function () {
    
    var transformFactory = $.__bodymovin.bm_transformReportFactory;
    var layerCollectionFactory;
    var MessageClass = $.__bodymovin.bm_messageClassReport;
    var generalUtils = $.__bodymovin.bm_generalUtils;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;

    function CompositionLayer(composition) {
        this.composition = composition;
        this.process();
    }
    
    generalUtils.extendPrototype(CompositionLayer, MessageClass);

    CompositionLayer.prototype.processLayers = function() {
        // Circular dependency since compositions contain collection of layers and are at the same time layers of a collection
        if (!layerCollectionFactory) {
            layerCollectionFactory = $.__bodymovin.bm_layerCollectionReport;
        }
        this.layerCollection = layerCollectionFactory(this.composition.source.layers);
    }

    CompositionLayer.prototype.processTransform = function() {
        this.transform = transformFactory(this.composition.transform);
    }

    CompositionLayer.prototype.process = function() {
        this.processLayers();
        this.processTransform();
    }

    CompositionLayer.prototype.serialize = function() {
        var layerCollectionData = this.layerCollection.serialize()
        return {
            layers: layerCollectionData.layers,
            transform: this.transform.serialize(),
        }
    }

    return function(composition) {
        return new CompositionLayer(composition);
    }
    
}());