/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_animationReport = (function () {
    
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var layerCollectionFactory = $.__bodymovin.bm_layerCollectionReport;

    function Animation(animation) {
        this.animation = animation;
        this.messages = [];
        bm_eventDispatcher.log('ANIMATION CONSTRUCT')
        this.layerCollection = layerCollectionFactory(animation.layers);
        bm_eventDispatcher.log('ANIMATION CONSTRUCT END')
    }

    Animation.prototype.serialize = function() {
        bm_eventDispatcher.log('ANIMATION SERIALIZE')
        var layerCollection = this.layerCollection.serialize();
        var serializedData = {
            layers: layerCollection.layers,
        };

        var messages = [];
        for (var i = 0; i < this.messages.length; i += 1) {
            messages.push(this.messages[i].serialize());
        }
        serializedData.messages = messages;
        bm_eventDispatcher.log('ANIMATION SERIALIZE END')
        return serializedData;
    }



    return function(animation) {
        return new Animation(animation);      
    }
    
}());