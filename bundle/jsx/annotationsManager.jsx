/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, File, app */

$.__bodymovin.bm_annotationsManager = (function () {
    'use strict';
    
    var ob;
    var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
    var bm_generalUtils = $.__bodymovin.bm_generalUtils;
    var presetHelper = $.__bodymovin.presetHelper;
    var layers = [];
    var textPropertyMatchName = 'Pseudo/Bodymovin Text Props 6'

    var pseudoEffects = [
        {
            path: '/assets/annotations/bodymovin_text_props_6.ffx',
            matchName: textPropertyMatchName,
            name: 'Text Properties',
        }
    ]

    var annotationMatchNames = [
        'Pseudo/Bodymovin Text Props 4',
        'Pseudo/Bodymovin Text Props 4-0001',
        'Pseudo/Bodymovin Text Props 4-0002',
        'Pseudo/Bodymovin Text Props 4-0003',
        'Pseudo/Bodymovin Text Props 4-0004',
        'Pseudo/Bodymovin Text Props 4-0005',
        'Pseudo/Bodymovin Text Props 4-0006',
        'Pseudo/Bodymovin Text Props 5',
        'Pseudo/Bodymovin Text Props 5-0001',
        'Pseudo/Bodymovin Text Props 5-0002',
        'Pseudo/Bodymovin Text Props 5-0003',
        'Pseudo/Bodymovin Text Props 5-0004',
        'Pseudo/Bodymovin Text Props 5-0005',
        'Pseudo/Bodymovin Text Props 5-0006',
        'Pseudo/Bodymovin Text Props 6',
        'Pseudo/Bodymovin Text Props 6-0001',
        'Pseudo/Bodymovin Text Props 6-0002',
        'Pseudo/Bodymovin Text Props 6-0003',
        'Pseudo/Bodymovin Text Props 6-0004',
        'Pseudo/Bodymovin Text Props 6-0005',
        'Pseudo/Bodymovin Text Props 6-0006',
        'Pseudo/Bodymovin Text Props 6-0007',
    ]

    function createLayerReference(layer) {
        return {
            layer: layer,
            id: bm_generalUtils.random(10),
        }
    }

    function findLayerId(layer) {
        var i = 0, len = layers.length;
        for (i = 0; i < len; i += 1) {
            if (layers[i].layer === layer) {
                return layers[i].id;
            }
        }
        var newLayer = createLayerReference(layer);
        layers.push(newLayer);
        return newLayer.id;
    }

    function findLayerById(id) {
        var i = 0, len = layers.length;
        for (i = 0; i < len; i += 1) {
            if (layers[i].id === id) {
                return layers[i].layer;
            }
        }
    }

    function searchPseudoEffectByMatchName(matchName) {
        var i = 0, len = pseudoEffects.length;
        while (i < len) {
            if (pseudoEffects[i].matchName === matchName) {
                return true;
            }
            i += 1;
        }
        return false;
    }

    function buildAnnotations(layer) {
        var effects = layer.effect;
        var i, effect;
        var annotations = []
        for (i = 0; i < effects.numProperties; i += 1) {
            effect = effects(i + 1);
            if (searchPseudoEffectByMatchName(effect.matchName)) {
                annotations.push({
                    matchName: effect.matchName
                })
            }
        }
        return annotations;
    }

    function buildLayerInfo(layer) {
        var layerId = findLayerId(layer);
        return {
            id: layerId,
            name: layer.name,
            annotations: buildAnnotations(layer),
        }
    }
    
    function getLayers() {
        if (app.project && app.project.activeItem && app.project.activeItem.selectedLayers) {
            var selectedLayers = app.project.activeItem.selectedLayers
            var i = 0;
            var layersInfo = []
            for (i = 0; i < selectedLayers.length; i += 1) {
                var layerInfo = buildLayerInfo(selectedLayers[i]);
                layersInfo.push(layerInfo);
            }
            bm_eventDispatcher.sendEvent('bm:annotations:list', layersInfo);
        }
    }

    function findPseudoEffectByMatchName(matchName) {
        for (var i = 0; i < pseudoEffects.length; i += 1) {
            if (pseudoEffects[i].matchName === matchName) {
                return pseudoEffects[i]
            }
        }
        return null;
    }

    function activateAnnotations(layerId, annotationId) {

        // Comment lines when applying new preset
        var layer = findLayerById(layerId);
        var pseudoEffect = findPseudoEffectByMatchName(annotationId) || pseudoEffects[0];
        if (layer) {
            presetHelper.applyPreset(layer, annotationId, pseudoEffect)
        }

        // DO NOT DELETE. USE WHEN ADDING NEW PSEUDO EFFECT TO SAVE AS FFX
        // var layer = findLayerById(layerId);
        // if (layer) {
        //     layer.property("Effects").addProperty('Pseudo/Bodymovin Text Props 6');
        // }
    }

    function getAvailableAnnotation() {
        bm_eventDispatcher.sendEvent('bm:annotations:annotationsList', pseudoEffects)
    }

    function addTextProperties(effect, data) {
        // matchnames are not working for inner elements
        // Pseudo/Bodymovin Text Props 3-0001 -> Pseudo/BM Vert Alignment
        // Pseudo/Bodymovin Text Props 3-0002 -> Pseudo/BM Resize Behavior
        // Pseudo/Bodymovin Text Props 3-0003 -> Pseudo/BM Multiline Behavior
        // Pseudo/Bodymovin Text Props 3-0004 -> Pseudo/BM Max Chars
        // Pseudo/Bodymovin Text Props 3-0005 -> Pseudo/BM Min Font
        // Pseudo/Bodymovin Text Props 3-0006 -> Pseudo/BM Max Font
        var i, len = effect.numProperties, prop;
        for (i = 0; i < len; i += 1) {
            prop = effect.property(i + 1);
            // bm_eventDispatcher.log('prop: ' + prop.matchName);
            // bm_eventDispatcher.log('VALUE: ' + prop.value);
            if (prop.matchName === 'Pseudo/Bodymovin Text Props 6-0001') {
                data.vj = prop.value - 1;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 6-0002') {
                data.rs = prop.value - 1;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 6-0003') {
                if (prop.value !== 1) {
                    data.m = prop.value - 2;
                }
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 6-0004') {
                data.mc = prop.value;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 6-0005') {
                data.mf = prop.value;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 6-0006') {
                data.xf = prop.value;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 6-0007') {
                data.lj = prop.value;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 5-0001') {
                data.vj = prop.value - 1;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 5-0002') {
                data.rs = prop.value - 1;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 5-0003') {
                if (prop.value !== 1) {
                    data.m = prop.value - 2;
                }
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 5-0004') {
                data.mc = prop.value;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 5-0005') {
                data.mf = prop.value;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 5-0006') {
                data.xf = prop.value;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 4-0001') {
                data.vj = prop.value - 1;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 4-0002') {
                data.rs = prop.value - 1;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 4-0003') {
                data.mc = prop.value;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 4-0004') {
                data.mf = prop.value;
            } else if (prop.matchName === 'Pseudo/Bodymovin Text Props 4-0005') {
                data.xf = prop.value;
            }
        }
    }

    function searchTextProperties(layerInfo) {
        var textDocumentData = {};
        if (!(layerInfo.effect && layerInfo.effect.numProperties > 0)) {
            return textDocumentData;
        }
        var effects = layerInfo.effect;
        
        var i, len = effects.numProperties, effectElement;
        for (i = 0; i < len; i += 1) {
            effectElement = effects(i + 1);
            if (effectElement.enabled && effectElement.matchName === textPropertyMatchName) {
                addTextProperties(effectElement, textDocumentData);
            }
        }
        return textDocumentData;
    }

    function isAnnotation(matchName) {
        var i, len = annotationMatchNames.length;
        // bm_eventDispatcher.log('matchName: ' + matchName);
        for (i = 0; i < len; i += 1) {
            if (annotationMatchNames[i] === matchName) {
                return true;
            }
        }
        return false;
    }

    ob = {
        getLayers: getLayers,
        activateAnnotations: activateAnnotations,
        getAvailableAnnotation: getAvailableAnnotation,
        findAnnotationEffectByMatchName: findPseudoEffectByMatchName,
        searchTextProperties: searchTextProperties,
        isAnnotation: isAnnotation,
    };
    
    return ob;
}());