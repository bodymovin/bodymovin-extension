/*jslint vars: true , plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $ */
$.__bodymovin.bm_essentialPropertiesHelper = (function () {
  'use strict';
  var ob = {};
  var bm_eventDispatcher = $.__bodymovin.bm_eventDispatcher;
  var bm_generalUtils = $.__bodymovin.bm_generalUtils;
  var keyframeHelper;

  var properties = [];
  var counter = 0;

  var propType = {
    Color: 1,
    Point: 2,
    Scale: 3,
    Float: 4,
    Undefined: 99,
  }

  var matchType = {
    'ADBE Vector Fill Color': propType.Color,
    'ADBE Vector Stroke Color': propType.Color,
    'ADBE Text Stroke Color': propType.Color,
    'ADBE Text Fill Color': propType.Color,
    'ADBE Position': propType.Point,
    'ADBE Vector Repeater Position': propType.Point,
    'ADBE Vector Repeater Anchor': propType.Point,
    'ADBE Anchor Point': propType.Point,
    'ADBE Vector Grad Start Pt': propType.Point,
    'ADBE Vector Grad End Pt': propType.Point,
    'ADBE Vector Rect Position': propType.Point,
    'ADBE Vector Ellipse Position': propType.Point,
    'ADBE Vector Star Position': propType.Point,
    'ADBE Text Anchor Point 3D': propType.Point,
    'ADBE Text Position 3D': propType.Point,
    'ADBE Vector Position': propType.Point,
    'ADBE Vector Anchor': propType.Point,
    'ADBE Opacity': propType.Float,
    'ADBE Vector Fill Opacity': propType.Float,
    'ADBE Vector Stroke Opacity': propType.Float,
    'ADBE Vector Stroke Width': propType.Float,
    'ADBE Position_0': propType.Float,
    'ADBE Position_1': propType.Float,
    'ADBE Position_2': propType.Float,
    'ADBE Rotate X': propType.Float,
    'ADBE Rotate Y': propType.Float,
    'ADBE Rotate Z': propType.Float,
    'ADBE Vector Rect Roundness': propType.Float,
    'ADBE Vector Star Points': propType.Float,
    'ADBE Vector Star Rotation': propType.Float,
    'ADBE Vector Star Inner Radius': propType.Float,
    'ADBE Vector Star Inner Roundess': propType.Float,
    'ADBE Vector Star Outer Radius': propType.Float,
    'ADBE Vector Star Outer Roundess': propType.Float,
    'ADBE Vector Offset Amount': propType.Float,
    'ADBE Vector Offset Miter Limit': propType.Float,
    'ADBE Vector PuckerBloat Amount': propType.Float,
    'ADBE Vector Repeater Copies': propType.Float,
    'ADBE Vector Repeater Offset': propType.Float,
    'ADBE Vector Repeater Rotation': propType.Float,
    'ADBE Vector Repeater Opacity 1': propType.Float,
    'ADBE Vector Repeater Opacity 2': propType.Float,
    'ADBE Vector RoundCorner Radius': propType.Float,
    'ADBE Vector Trim Start': propType.Float,
    'ADBE Vector Trim End': propType.Float,
    'ADBE Vector Trim Offset': propType.Float,
    'ADBE Vector Twist Angle': propType.Float,
    'ADBE Vector Twist Center': propType.Float,
    'ADBE Vector Zigzag Size': propType.Float,
    'ADBE Vector Zigzag Detail': propType.Float,
    'ADBE Text Percent Start': propType.Float,
    'ADBE Text Percent End': propType.Float,
    'ADBE Text Index Start': propType.Float,
    'ADBE Text Index End': propType.Float,
    'ADBE Text Levels Max Ease': propType.Float,
    'ADBE Text Levels Min Ease': propType.Float,
    'ADBE Text Selector Max Amount': propType.Float,
    'ADBE Text Skew': propType.Float,
    'ADBE Text Skew Axis': propType.Float,
    'ADBE Text Rotation': propType.Float,
    'ADBE Text Opacity': propType.Float,
    'ADBE Text Fill Hue': propType.Float,
    'ADBE Text Fill Saturation': propType.Float,
    'ADBE Text Fill Brightness': propType.Float,
    'ADBE Text Stroke Opacity': propType.Float,
    'ADBE Text Stroke Hue': propType.Float,
    'ADBE Text Stroke Saturation': propType.Float,
    'ADBE Text Stroke Brightness': propType.Float,
    'ADBE Text Stroke Width': propType.Float,
    'ADBE Text Tracking Amount': propType.Float,
    'ADBE Vector Rotation': propType.Float,
    'ADBE Vector Group Opacity': propType.Float,
    'ADBE Vector Skew': propType.Float,
    'ADBE Vector Skew Axis': propType.Float,
    'ADBE Scale': propType.Scale,
    'ADBE Vector Rect Size': propType.Scale,
    'ADBE Vector Ellipse Size': propType.Scale,
    'ADBE Vector Repeater Scale': propType.Scale,
    'ADBE Text Scale 3D': propType.Scale,
    'ADBE Vector Scale': propType.Scale,
  }

  function iterateProperty(parent, frameRate) {
    var totalProperties = parent.numProperties;
      for (var i = 0; i < totalProperties; i += 1) {
        var property = parent.property(i + 1);
        var propData = {
          property: property,
          // id: 'prop_' + counter++,
          id: property.name,
        }
        // TODO: check if there is a better way to identify type
        if (property.matchName === 'ADBE Layer Source Alternate') {
          // It's a layer source
          propData.type = 'source';
        } else if (property.matchName === 'ADBE Layer Overrides Group') {
          // bm_eventDispatcher.log('=== ITERATE ===')
          iterateProperty(property, frameRate);
        } else {
          // It's a property
          // bm_generalUtils.iterateProperty(property)
          // bm_generalUtils.iterateOwnProperties(property)
          propData.type = 'property';
          if (propData.id.substr(0, 1) === '#') {
            bm_eventDispatcher.log('=== EXPORT SOURCE ===')
            propData.val = keyframeHelper.exportKeyframes(property.essentialPropertySource, frameRate, 1);
          } else {
            bm_eventDispatcher.log('=== EXPORT PROPERTY ===')
            propData.val = keyframeHelper.exportKeyframes(property, frameRate, 1);
          }
        }
        properties.push(propData);
      }
  }
  
  function addCompProperties(composition, frameRate) {
    try {
      if (!composition.essentialProperty) {
        return;
      }
      
      if (!keyframeHelper) {
        keyframeHelper = $.__bodymovin.bm_keyframeHelper;
      }
      var essentialProperty = composition.essentialProperty;
      iterateProperty(essentialProperty, frameRate);

    } catch (error) {
      if (error) {
        bm_eventDispatcher.log('ERROR:essentialPropertiesHelper:addCompProperties');
        bm_eventDispatcher.log(error.message);
        bm_eventDispatcher.log(error.line);
        bm_eventDispatcher.log(error.fileName);
      }
      bm_eventDispatcher.log($.stack);
    }
  }

  function searchProperty(property) {
    var i, len = properties.length;
    for(i = 0; i < len; i += 1) {
      // Not using strict equality because sources don't match
      // eslint-disable-next-line eqeqeq
      if (properties[i].property.essentialPropertySource == property) {
        if (matchType[property.matchName]) {
          properties[i].prop.t = matchType[property.matchName];
        } else {
          properties[i].prop.t = propType.Undefined;
        }
        return properties[i];
      }
    }
    return null;
  }

  function exportProperties() {
    var props = {};
    var count = 0;
    for (var i = 0; i < properties.length; i += 1) {
      if (properties[i].type === 'property') {
        var prop = {
          p: properties[i].val,
        }
        properties[i].prop = prop;
        count += 1;
        props[properties[i].id] = prop;
      }
    }
    if (count === 0) {
      return undefined;
    }
    return props;
  }

  function reset() {
    counter = 0;
    properties = [];
  }
  
  ob.addCompProperties = addCompProperties;
  ob.exportProperties = exportProperties;
  ob.searchProperty = searchProperty;
  ob.reset = reset;
  
  return ob;
}());