/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_shapeReportHelper = (function () {
    
    var ob;
    var shapeTypes = $.__bodymovin.shapeTypes;
    var getShapeType = $.__bodymovin.getShapeType;
    var shapeUnhandled = $.__bodymovin.bm_shapeUnhandledReport;
    var shapeRect = $.__bodymovin.bm_shapeRectReport;
    var shapeShape = $.__bodymovin.bm_shapeShapeReport;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;

    function buildShape(element) {
        return shapeShape(element)
    }

    function buildRect(element) {
        return shapeRect(element)
    }

    function buildUnhandled(element) {
        return shapeUnhandled(element)
    }

    var builders = {}
    builders[shapeTypes.shape] = buildShape
    builders[shapeTypes.rect] = buildRect

    function processShape(element) {
        bm_eventDispatcher.log(element.matchName);
        bm_eventDispatcher.log(getShapeType(element.matchName));
        var shapeType = getShapeType(element.matchName);
        if (builders[shapeType]) {
            return builders[shapeType](element);
        } else {
            return buildUnhandled(element)
        }
    }


    ob = {
        processShape: processShape,
    };
    
    return ob;
}());