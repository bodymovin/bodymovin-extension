/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_layerStylesDropShadowFactory = (function () {
    
    var generalUtils = $.__bodymovin.bm_generalUtils;
    var MessageClass = $.__bodymovin.bm_messageClassReport;
    var layerStyleTypes = $.__bodymovin.layerStyleTypes;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var rendererTypes = $.__bodymovin.bm_reportRendererTypes;
    var messageTypes = $.__bodymovin.bm_reportMessageTypes;
    var builderTypes = $.__bodymovin.bm_reportBuilderTypes;
    var propertyReport = $.__bodymovin.bm_propertyReport;

    function DropShadow(style) {
        this.style = style;
        this.messages = [];
        this.process();
    }
    generalUtils.extendPrototype(DropShadow, MessageClass);

    DropShadow.prototype.processProperties = function() {
        // Color
        this.color = propertyReport(this.style.property('dropShadow/color'));
        // // Opacity
        this.opacity = propertyReport(this.style.property('dropShadow/opacity'));
        // // Angle
        // ob.a = bm_keyframeHelper.exportKeyframes(style.property('dropShadow/localLightingAngle'), frameRate, stretch);
        // // Size
        // ob.s = bm_keyframeHelper.exportKeyframes(style.property('dropShadow/blur'), frameRate, stretch);
        // // Distance
        // ob.d = bm_keyframeHelper.exportKeyframes(style.property('dropShadow/distance'), frameRate, stretch);
        // // Choke/Spread
        // ob.ch = bm_keyframeHelper.exportKeyframes(style.property('dropShadow/chokeMatte'), frameRate, stretch);
        // // Blend Mode
        // ob.bm = bm_keyframeHelper.exportKeyframes(style.property('dropShadow/mode2'), frameRate, stretch);
        // // Noise
        // ob.no = bm_keyframeHelper.exportKeyframes(style.property('dropShadow/noise'), frameRate, stretch);
        // // Layer Knocks Out Drop Shadow
        // ob.lc = bm_keyframeHelper.exportKeyframes(style.property('dropShadow/layerConceals'), frameRate, stretch);
    }

    DropShadow.prototype.processStyle = function() {
        this.addMessage(messageTypes.WARNING,
        [
            rendererTypes.BROWSER,
            rendererTypes.IOS,
            rendererTypes.ANDROID,
        ],
        builderTypes.UNSUPPORTED_STYLE);
    }

    DropShadow.prototype.process = function() {
        this.processProperties();
        this.processStyle();
    }

    DropShadow.prototype.serialize = function() {
        return {
            name: this.style.name,
            type: layerStyleTypes.dropShadow,
            messages: this.serializeMessages(),
            color: this.color.serialize(),
            opacity: this.opacity.serialize(),
        }
    }

    return function(style) {
        return new DropShadow(style);
    }
    
}());