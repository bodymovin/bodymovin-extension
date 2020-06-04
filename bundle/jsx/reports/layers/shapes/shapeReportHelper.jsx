/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_shapeReportHelper = (function () {
    
    var ob;
    var shapeTypes = $.__bodymovin.shapeTypes;
    var getShapeType = $.__bodymovin.getShapeType;
    var shapeUnhandled = $.__bodymovin.bm_shapeUnhandledReport;
    var shapeRect = $.__bodymovin.bm_shapeRectReport;
    var shapeShape = $.__bodymovin.bm_shapeShapeReport;
    var shapeEllipse = $.__bodymovin.bm_shapeEllipseReport;
    var shapeStroke = $.__bodymovin.bm_shapeStrokeReport;
    var shapeFill = $.__bodymovin.bm_shapeFillReport;
    var shapeGroup = $.__bodymovin.bm_shapeGroupReport;
    var shapeRepeater = $.__bodymovin.bm_shapeRepeaterReport;
    var shapeStar = $.__bodymovin.bm_shapeStarReport;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;

    function buildShape(element) {
        return shapeShape(element)
    }

    function buildRect(element) {
        return shapeRect(element)
    }

    function buildEllipse(element) {
        return shapeEllipse(element)
    }

    function buildStroke(element) {
        return shapeStroke(element)
    }


    function buildFill(element) {
        return shapeFill(element)
    }

    function buildGroup(element) {
        return shapeGroup(element)
    }

    function buildRepeater(element) {
        return shapeRepeater(element)
    }

    function buildStar(element) {
        return shapeStar(element)
    }

    function buildUnhandled(element) {
        return shapeUnhandled(element)
    }

    var builders = {}
    builders[shapeTypes.shape] = buildShape
    builders[shapeTypes.rect] = buildRect
    builders[shapeTypes.ellipse] = buildEllipse
    builders[shapeTypes.stroke] = buildStroke
    builders[shapeTypes.fill] = buildFill
    builders[shapeTypes.group] = buildGroup
    builders[shapeTypes.repeater] = buildRepeater
    builders[shapeTypes.star] = buildStar

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