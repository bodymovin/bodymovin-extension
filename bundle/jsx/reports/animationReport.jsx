/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_animationReport = (function () {
    
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var layerCollectionFactory = $.__bodymovin.bm_layerCollectionReport;

    function Animation(animation) {
        this.animation = animation;
        this.messages = [];
        bm_eventDispatcher.log('ANIMATION CONSTRUCT');
        try {
            this.layerCollection = layerCollectionFactory(animation.layers);
        } catch(error) {
            bm_eventDispatcher.log('ERROR CONSTRUCT');
            bm_eventDispatcher.log(error.message);
            bm_eventDispatcher.log(error.line);
            bm_eventDispatcher.log(error.fileName);
            bm_eventDispatcher.log($.stack);
        }
        bm_eventDispatcher.log('ANIMATION CONSTRUCT END');
    }

    Animation.prototype.serialize = function() {
        try {
            bm_eventDispatcher.log('ANIMATION SERIALIZE');
            var layerCollection = this.layerCollection.serialize();
            var serializedData = {
                layers: layerCollection.layers,
            };

            var messages = [];
            for (var i = 0; i < this.messages.length; i += 1) {
                messages.push(this.messages[i].serialize());
            }
            serializedData.messages = messages;
            return serializedData;
        } catch(error) {
            bm_eventDispatcher.log('ERROR SERIALIZE');
            bm_eventDispatcher.log(error.message);
            bm_eventDispatcher.log(error.line);
            bm_eventDispatcher.log(error.fileName);
            bm_eventDispatcher.log($.stack);
            return null;
        }
    }



    return function(animation) {
        return new Animation(animation);      
    }
    
}());