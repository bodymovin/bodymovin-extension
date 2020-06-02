/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_layerReport = (function () {
    
    var MessageClass = $.__bodymovin.bm_messageClassReport;
    var generalUtils = $.__bodymovin.bm_generalUtils;
    var rendererTypes = $.__bodymovin.bm_reportRendererTypes;
    var builderTypes = $.__bodymovin.bm_reportBuilderTypes;
    var messageTypes = $.__bodymovin.bm_reportMessageTypes;
    var transformFactory = $.__bodymovin.bm_transformReportFactory;
    var effectsFactory = $.__bodymovin.bm_effectsReportFactory;
    var settingsHelper = $.__bodymovin.bm_settingsHelper;
    var getLayerType = $.__bodymovin.getLayerType;

    function Layer(layer) {
        this.layer = layer;
        this.process();
    }

    generalUtils.extendPrototype(Layer, MessageClass);

    Layer.prototype.process = function() {
        this.processProperties();
        this.processTransform();
        this.processEffects();
    }

    Layer.prototype.processProperties = function() {
        if ((!this.layer.enabled && settingsHelper.shouldIncludeHiddenLayers()) 
            || (this.layer.guideLayer && settingsHelper.shouldIncludeGuidedLayers())) {
            this.addMessage(messageTypes.WARNING,
            [
                rendererTypes.SKOTTIE,
                rendererTypes.IOS,
                rendererTypes.ANDROID,
            ],
            builderTypes.DISABLED_LAYER);
        }
        if (this.layer.motionBlur) {
            this.addMessage(messageTypes.WARNING,
            [
                rendererTypes.BROWSER,
                rendererTypes.IOS,
                rendererTypes.ANDROID,
            ],
            builderTypes.MOTION_BLUR);
        }
        if (this.layer.preserveTransparency) {
            this.addMessage(messageTypes.WARNING,
            [
                rendererTypes.BROWSER,
                rendererTypes.SKOTTIE,
                rendererTypes.IOS,
                rendererTypes.ANDROID,
            ],
            builderTypes.PRESERVE_TRANSPARENCY);
        }
        if (this.layer.threeDLayer) {
            this.addMessage(messageTypes.ERROR,
            [
                rendererTypes.SKOTTIE,
                rendererTypes.IOS,
                rendererTypes.ANDROID,
            ],
            builderTypes.THREE_D_LAYER);
        }
        if (this.layer.threeDLayer) {
            this.addMessage(messageTypes.WARNING,
            [
                rendererTypes.BROWSER,
            ],
            builderTypes.THREE_D_LAYER);
        }
    }

    Layer.prototype.processTransform = function() {
        this.transform = transformFactory(this.layer.transform, this.layer.threeDLayer);
    }

    Layer.prototype.processEffects = function() {
        this.effects = effectsFactory(this.layer.effect);
    }

    Layer.prototype.serialize = function() {
    	return {
            name: this.layer.name,
            index: this.layer.index,
            type: getLayerType(this.layer),
            messages: this.serializeMessages(),
            transform: this.transform.serialize(),
            effects: this.effects.serialize(),
        }
    }


    return function(layer) {
    	return new Layer(layer);
    }
    
}());