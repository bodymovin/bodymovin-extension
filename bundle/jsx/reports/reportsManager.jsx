/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_reportsManager = (function () {
    
    var ob;
    var propertyReport = $.__bodymovin.bm_propertyReport

    function deleteParams(data) {

    }

    ob = {
        deleteParams: deleteParams,
        createPropertyReport: propertyReport.create,
    };
    
    return ob;
}());