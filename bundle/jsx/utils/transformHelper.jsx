/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global bm_keyframeHelper, bm_generalUtils, bm_eventDispatcher*/
var bm_transformHelper = (function () {
    'use strict';
    var ob = {};
    
    function exportTransform(layerInfo, data, frameRate) {
        if (!layerInfo.transform) {
            return;
        }
        
        data.ks = {};
        if (layerInfo.transform.opacity) {
            data.ks.o = bm_keyframeHelper.exportKeyframes(layerInfo.transform.opacity, frameRate);
        }
        if (layerInfo.threeDLayer) {
            data.ks.rx = bm_keyframeHelper.exportKeyframes(layerInfo.transform.property('ADBE Rotate X'), frameRate);
            data.ks.ry = bm_keyframeHelper.exportKeyframes(layerInfo.transform.property('ADBE Rotate Y'), frameRate);
            data.ks.rz = bm_keyframeHelper.exportKeyframes(layerInfo.transform.property('ADBE Rotate Z'), frameRate);
            data.ks.or = bm_keyframeHelper.exportKeyframes(layerInfo.transform.Orientation, frameRate);
        } else {
            data.ks.r = bm_keyframeHelper.exportKeyframes(layerInfo.transform.rotation, frameRate);
        }
        if (layerInfo.transform.position.dimensionsSeparated) {
            data.ks.p = {s: true};
            data.ks.p.x = bm_keyframeHelper.exportKeyframes(layerInfo.transform.property('ADBE Position_0'), frameRate);
            data.ks.p.y = bm_keyframeHelper.exportKeyframes(layerInfo.transform.property('ADBE Position_1'), frameRate);
            if (layerInfo.threeDLayer) {
                data.ks.p.z = bm_keyframeHelper.exportKeyframes(layerInfo.transform.property('ADBE Position_2'), frameRate);
            }
        } else {
            data.ks.p = bm_keyframeHelper.exportKeyframes(layerInfo.transform.position, frameRate);
        }
        if (layerInfo.transform.property('ADBE Anchor Point')) {
            data.ks.a = bm_keyframeHelper.exportKeyframes(layerInfo.transform.property('ADBE Anchor Point'), frameRate);
        }
        if (layerInfo.transform.Scale) {
            data.ks.s = bm_keyframeHelper.exportKeyframes(layerInfo.transform.Scale, frameRate);
        }
        if(layerInfo.autoOrient === AutoOrientType.ALONG_PATH){
            data.ao = 1;
        } else {
            data.ao = 0;
        }
    }
    
    ob.exportTransform = exportTransform;
    return ob;
}());