/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global bm_keyframeHelper*/
$.__bodymovin.bm_layerStylesHelper = (function () {
    'use strict';
    var bm_keyframeHelper = $.__bodymovin.bm_keyframeHelper;
    var ob = {};
    var layerStyleTypes = {
        stroke: 0
    };
    
    function getStyleType(name) {
        switch (name) {
        case 'frameFX/enabled':
            return layerStyleTypes.stroke;
        default:
            return '';
        }
    }
    
    function exportStroke(style, frameRate, stretch) {
        var ob = {};
        ob.ty = layerStyleTypes.stroke;
        ob.nm = style.name;
        ob.c = bm_keyframeHelper.exportKeyframes(style.property('frameFX/color'), frameRate, stretch);
        ob.s = bm_keyframeHelper.exportKeyframes(style.property('frameFX/size'), frameRate, stretch);
        return ob;
    }
    
    function exportStyles(layerInfo, layerData, frameRate) {
        if (!(layerInfo.property('Layer Styles') && layerInfo.property('Layer Styles').numProperties > 0)) {
            return;
        }
        var stretch = layerData.sr;
        var styles = layerInfo.property('Layer Styles');
        var i, len = styles.numProperties, styleElement;
        var stylesArray = [];
        for (i = 0; i < len; i += 1) {
            styleElement = styles(i + 1);
            if (styleElement.isModified) {
                var styleType = getStyleType(styleElement.matchName);
                switch (styleType) {
                case layerStyleTypes.stroke:
                    stylesArray.push(exportStroke(styleElement, frameRate, stretch));
                    break;
                }
            }
        }
        if (stylesArray.length) {
            layerData.sy = stylesArray;
        }
    }
    
    ob.exportStyles = exportStyles;
    
    return ob;
}());