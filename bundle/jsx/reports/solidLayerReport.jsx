/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_solidLayerReport = (function () {
    
    var transformFactory = $.__bodymovin.bm_transformReportFactory;

    function SolidLayer(layer) {
        this.layer = layer;
        this.layers = [];
        this.process();
    }

    SolidLayer.prototype.processTransform = function() {
        this.transform = transformFactory(this.layer.transform);
    }

    SolidLayer.prototype.process = function() {
        this.processTransform();
    }

    SolidLayer.prototype.serialize = function() {
        return {
            transform: this.transform.serialize(),
        }
    }



    return function(layer) {
        return new SolidLayer(layer);
    }
    
}());