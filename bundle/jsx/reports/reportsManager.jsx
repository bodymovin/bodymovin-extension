/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_reportsManager = (function () {
    
    var ob;
    var reportData

    function startReport() {
        reportData = {}
    }


    ob = {
        startReport: startReport
    };
    
    return ob;
}());