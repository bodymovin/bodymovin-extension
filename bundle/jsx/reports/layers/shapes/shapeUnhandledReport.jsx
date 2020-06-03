/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_shapeUnhandledReport = (function () {
    
    var MessageClass = $.__bodymovin.bm_messageClassReport;
    var generalUtils = $.__bodymovin.bm_generalUtils;

    function Unhandled(element) {
        this.element = element;
        this.process();
    }
    
    generalUtils.extendPrototype(Unhandled, MessageClass);

    Unhandled.prototype.processShape = function() {
        this.shape = {};
    }

    Unhandled.prototype.process = function() {
        this.processLayer();
    }

    Unhandled.prototype.serialize = function() {
        return this.shape;
    }



    return function(element) {
        return new Unhandled(element);
    }
    
}());