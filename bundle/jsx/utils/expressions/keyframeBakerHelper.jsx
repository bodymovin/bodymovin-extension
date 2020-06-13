/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, PropertyValueType*/

$.__bodymovin.bm_keyframeBakerHelper = (function () {


    var bm_generalUtils = $.__bodymovin.bm_generalUtils;
    var renderHelper = $.__bodymovin.bm_renderHelper;

    'use strict';
    var ob;
    var easePointsTemplates = (
        function() {
            var simple_in = {x:1,y:1};
            var array_1d_in = {x:[1],y:[1]};
            var array_2d_in = {x:[1,1],y:[1,1]};
            var array_3d_in = {x:[1,1,1],y:[1,1,1]};
            var templates;
            var inPointTemplate = {};
            inPointTemplate[PropertyValueType.ThreeD_SPATIAL] = simple_in;
            inPointTemplate[PropertyValueType.TwoD_SPATIAL] = simple_in;
            inPointTemplate[PropertyValueType.SHAPE] = simple_in;
            inPointTemplate[PropertyValueType.NO_VALUE] = simple_in;
            inPointTemplate[PropertyValueType.COLOR] = array_1d_in;
            inPointTemplate[PropertyValueType.OneD] = array_1d_in;
            inPointTemplate[PropertyValueType.TwoD] = array_2d_in;
            inPointTemplate[PropertyValueType.ThreeD] = array_3d_in;
            var simple_out = {x:0,y:0};
            var array_1d_out = {x:[0],y:[0]};
            var array_2d_out = {x:[0,0],y:[0,0]};
            var array_3d_out = {x:[0,0,0],y:[0,0,0]};
            var outPointTemplate = {};
            outPointTemplate[PropertyValueType.ThreeD_SPATIAL] = simple_out;
            outPointTemplate[PropertyValueType.TwoD_SPATIAL] = simple_out;
            outPointTemplate[PropertyValueType.SHAPE] = simple_out;
            outPointTemplate[PropertyValueType.NO_VALUE] = simple_out;
            outPointTemplate[PropertyValueType.COLOR] = array_1d_out;
            outPointTemplate[PropertyValueType.OneD] = array_1d_out;
            outPointTemplate[PropertyValueType.TwoD] = array_2d_out;
            outPointTemplate[PropertyValueType.ThreeD] = array_3d_out;
            templates = {
                inPoint: inPointTemplate,
                outPoint: outPointTemplate,
            }
            return templates;
        }()
    )

    function equal(value1, value2) {
        if (typeof value1 === 'number') {
            return value1 === value2;
        } else {
            var i = 0, len = value1.length;
            while (i < len) {
                if (value1[i] !== value2[i]) {
                    return false;
                }
                i += 1;
            }
            return true;
        }
    }

    function checkPrevValueFromKeyframes(prop, value, keyframes) {
        if (keyframes.length > 1) {
            var prevValue = keyframes[keyframes.length - 1].s;
            var secondPrevValue = keyframes[keyframes.length - 2].s;
            if (equal(prevValue, value) && equal(secondPrevValue, value)) {
                keyframes.pop();
            }
        }
    }

    function getBakedValueAtTime(prop, time) {
        var value = prop.valueAtTime(time, false);
        if (prop.propertyValueType === PropertyValueType.SHAPE) {
            value = {
                i : bm_generalUtils.roundNumber(value.inTangents, 3),
                o : bm_generalUtils.roundNumber(value.outTangents, 3),
                v : bm_generalUtils.roundNumber(value.vertices, 3),
                c: value.closed
            }
            value = [value];
        } else {
            value = bm_generalUtils.roundNumber(value, 3);
            if(!(value instanceof Array)) {
                value = [value];
            }
        }
        return value;
    }

    function bakeExpressions(prop, frameRate) {
        var keyframes = [];
        var range = renderHelper.getCurrentRange();
        var time = range[0];
        var index = 0;
        var totalFrames = (range[1] - range[0]) * frameRate;
        for (index = 0; index < totalFrames; index += 1) {
            var value = getBakedValueAtTime(prop, time + index / frameRate);
            checkPrevValueFromKeyframes(prop, value, keyframes);
            keyframes.push({
                s: value,
                t: time * frameRate + index,
                i: easePointsTemplates.inPoint[prop.propertyValueType],
                o: easePointsTemplates.outPoint[prop.propertyValueType],
            })
        }
        return {
            k: keyframes,
        }
    }
    
    return bakeExpressions;

}())