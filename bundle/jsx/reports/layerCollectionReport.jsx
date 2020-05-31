/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_layerCollectionReport = (function () {
    
    var layerReport = $.__bodymovin.bm_layerReport;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;

    function LayerCollection(layers) {
        this.layers = layers;
        this.collection = [];
        this.process();
    }

    LayerCollection.prototype.process = function() {
        var layers = this.layers;
        var collection = this.collection;
        var i, len = layers.length;
        var layer;
        for (i = 0; i < len; i += 1) {
            layer = layers[i + 1];
            collection.push(layerReport.processLayer(layer));
        }
    }

    LayerCollection.prototype.serialize = function() {
    	var layers = [];
        for(var i = 0; i < this.collection.length; i += 1) {
            layers.push(this.collection[i].serialize());
        }
        return {
            layers: layers,
        }
    }


    return function(layers) {
    	return new LayerCollection(layers);
    }
    
}());