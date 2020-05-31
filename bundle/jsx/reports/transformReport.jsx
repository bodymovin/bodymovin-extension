/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_transformReportFactory = (function () {
    
    var propertyReport = $.__bodymovin.bm_propertyReport;

    function Transform(transform) {
        this.transform = transform;
        this.processProperties(transform);
    }

    Transform.prototype.processProperties = function() {
        this.scale = propertyReport(this.transform.Scale)
    }

    Transform.prototype.serialize = function() {
        return {
            s: this.scale.serialize(),
        }
    }



    return function(transform) {
        return new Transform(transform);
    }
    
}());