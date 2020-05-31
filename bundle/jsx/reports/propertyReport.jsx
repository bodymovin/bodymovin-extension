/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_propertyReport = (function () {
    
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var rendererTypes = $.__bodymovin.bm_reportRendererTypes;
    var builderTypes = $.__bodymovin.bm_reportBuilderTypes;
    var messageTypes = $.__bodymovin.bm_reportMessageTypes;
    var MessageClass = $.__bodymovin.bm_messageClassReport;
    var generalUtils = $.__bodymovin.bm_generalUtils;

    function Property(property) {
        this.property = property;
        this.process();
    }

    generalUtils.extendPrototype(Property, MessageClass);

    Property.prototype.processExpressions = function() {
        var property = this.property;
        if (property.expressionEnabled && !property.expressionError) {
            this.addMessage(messageTypes.ERROR,
            [
                rendererTypes.SKOTTIE,
                rendererTypes.IOS,
                rendererTypes.ANDROID,
            ],
            builderTypes.EXPRESSIONS);
        }
    }

    Property.prototype.process = function() {
        this.initializeMessages();
        this.processExpressions();
    }

    Property.prototype.serialize = function() {
    	return this.serializeMessages();
    }


    return function(property) {
    	return new Property(property);
    }
    
}());