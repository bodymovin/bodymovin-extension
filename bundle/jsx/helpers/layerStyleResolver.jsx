/*jslint vars: true , plusplus: true, continue:true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, CompItem, PlaceholderSource, AVLayer, CameraLayer, LightLayer, ShapeLayer, TextLayer */

$.__bodymovin.getLayerStyleType = (function () {

    var layerStyleTypes = $.__bodymovin.layerStyleTypes;
    
    return function (name) {
        switch (name) {
        case 'frameFX/enabled':
            return layerStyleTypes.stroke;
        case 'dropShadow/enabled':
            return layerStyleTypes.dropShadow;
        case 'innerShadow/enabled':
            return layerStyleTypes.innerShadow;
        case 'outerGlow/enabled':
            return layerStyleTypes.outerGlow;
        case 'innerGlow/enabled':
            return layerStyleTypes.innerGlow;
        default:
            return '';
        }
    };
}());