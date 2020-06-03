/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_shapeLayerReport = (function () {
    
    var MessageClass = $.__bodymovin.bm_messageClassReport;
    var generalUtils = $.__bodymovin.bm_generalUtils;
    var layerReport = $.__bodymovin.bm_layerReport;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var shapeCollectionFactory = $.__bodymovin.bm_shapeCollectionReport;


    function ShapeLayer(shape) {
        this.shape = shape;
        this.process();
    }
    
    generalUtils.extendPrototype(ShapeLayer, MessageClass);


    ShapeLayer.prototype.processLayer = function() {
        this.layerReport = layerReport(this.shape);
    }

    ShapeLayer.prototype.processShapes = function() {
        var shapes = this.shape.property('ADBE Root Vectors Group');
        this.shapesCollection = shapeCollectionFactory(shapes);
    }

    ShapeLayer.prototype.process = function() {
        this.processLayer();
        this.processShapes();
    }

    ShapeLayer.prototype.serialize = function() {
        var layerReportData = this.layerReport.serialize();
        var localMessages = this.serializeMessages();
        var shapesCollection = this.shapesCollection.serialize();
        var serializedData = {}
        for (var s in layerReportData) {
            if (layerReportData.hasOwnProperty(s)) {
                if (s === 'messages') {
                    serializedData[s] = localMessages.concat(layerReportData[s]);
                } else {
                    serializedData[s] = layerReportData[s];
                }
            }
        }
        serializedData.shapes = shapesCollection.shapes;
        return serializedData;
    }

    return function(shape) {
        return new ShapeLayer(shape);
    }
    
}());