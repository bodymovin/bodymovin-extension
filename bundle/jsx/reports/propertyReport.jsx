/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_propertyReport = (function () {
    
    var reportMessageFactory = $.__bodymovin.bm_reportMessageFactory;

    function Property(property) {
        var report = reportMessageFactory();
        if (property.expressionEnabled && !property.expressionError) {
        	report.addMessage('a', []);
        }
        this.report = report
    }

    Property.prototype.serialize = function() {
    	return this.report.serialize();
    }


    return function(property) {
    	return new Property(property);
    }
    
}());