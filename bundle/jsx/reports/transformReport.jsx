/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_transformReportFactory = (function () {
    
    var propertyReport = $.__bodymovin.bm_propertyReport;
    var positionReport = $.__bodymovin.bm_positionReport;
    var rotationReport = $.__bodymovin.bm_rotationReport;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;

    function Transform(transform, isThreeD) {
        this.transform = transform;
        this.isThreeD = isThreeD || false;
        this.process();
    }

    Transform.prototype.processProperties = function() {
        if (this.transform.Scale) {
            this.scale = propertyReport(this.transform.Scale);
        }
        if (this.transform.Opacity) {
            this.opacity = propertyReport(this.transform.Opacity);
        }
        if (this.transform.property('ADBE Anchor Point')) {
            this.anchorPoint = propertyReport(this.transform.property('ADBE Anchor Point'));
        }
        
        this.rotation = rotationReport(this.transform, this.isThreeD);
        this.position = positionReport(this.transform, this.isThreeD);
    }

    Transform.prototype.process = function() {
        this.processProperties();
    }

    Transform.prototype.serialize = function() {
        return {
            anchorPoint: this.anchorPoint.serialize(),
            scale: this.scale ? this.scale.serialize() : undefined,
            opacity: this.opacity ? this.opacity.serialize() : undefined,
            rotation: this.rotation ? this.rotation.serialize() : undefined,
            position: this.position.serialize(),
        }
    }



    return function(transform, isThreeD) {
        return new Transform(transform, isThreeD);
    }
    
}());