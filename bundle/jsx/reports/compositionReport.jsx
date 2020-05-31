/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_compositionReport = (function () {
    
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var transformFactory = $.__bodymovin.bm_transformReportFactory;
    var layerCollectionFactory = $.__bodymovin.bm_layerCollectionReport;
    var generalUtils = $.__bodymovin.bm_generalUtils

    function Composition(composition) {
        this.composition = composition;
        this.layerCollection;
        this.process();
    }

    Composition.prototype.processLayers = function() {
        this.layerCollection = layerCollectionFactory(this.composition.layers);
    }

    Composition.prototype.processTransform = function() {
        bm_eventDispatcher.log('processTransform')
        generalUtils.iterateProperty(this.composition)
        generalUtils.iterateOwnProperties(this.composition)
        bm_eventDispatcher.log(typeof this.composition.transform)
        bm_eventDispatcher.log(typeof transformFactory)
        this.transform = transformFactory(this.composition.transform);
        bm_eventDispatcher.log('processTransform end')
    }

    Composition.prototype.process = function() {
        this.processLayers();
        this.processTransform();
    }

    Composition.prototype.serialize = function() {
        var layerCollectionData = this.layerCollection.serialize()
        return {
            layers: layerCollectionData.layers,
            transform: this.transform.serialize(),
        }
    }



    return function(composition) {
        return new Composition(composition);
    }
    
}());