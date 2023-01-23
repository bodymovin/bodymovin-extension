import propTypes from "../../enums/propTypes";
import shapeTypes from "../../enums/shapeTypes";
import createProp from "../../helpers/propFactory";

const searchPropertyInEllipse = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.ELLIPSE];
  return [
    createProp(data.p, propTypes.ELLIPSE_POSITION, path),
    createProp(data.s, propTypes.ELLIPSE_SIZE, path),
  ]
}

const searchPropertyInRectangle = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.RECT];
  return [
    createProp(data.p, propTypes.RECTANGLE_POSITION, path),
    createProp(data.s, propTypes.RECTANGLE_SIZE, path),
    createProp(data.r, propTypes.RECTANGLE_RADIUS, path),
  ]
}

const searchPropertyInStar = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.STAR];
  return [
    createProp(data.ir, propTypes.STAR_INNER_RADIUS, path),
    createProp(data.is, propTypes.STAR_INNER_SIZE, path),
    createProp(data.or, propTypes.STAR_OUTER_RADIUS, path),
    createProp(data.os, propTypes.STAR_OUTER_SIZE, path),
    createProp(data.p, propTypes.STAR_POSITION, path),
    createProp(data.r, propTypes.STAR_RADIUS, path),
    createProp(data.pt, propTypes.STAR_POINTS, path),
  ]
}

const searchPropertyInOffsetPaths = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.OFFSETPATH];
  return [
    createProp(data.a, propTypes.OFFSET_PATHS_AMOUNT, path),
    createProp(data.ml, propTypes.OFFSET_PATHS_MITER_LIMIT, path),
  ]
}

const searchPropertyInRoundedCorners = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.ROUNDEDCORNERS];
  return [
    createProp(data.r, propTypes.ROUNDED_CORNERS_RADIUS, path),
  ]
}

const searchPropertyInTrimPaths = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.TRIM];
  return [
    createProp(data.s, propTypes.TRIM_PATH_START, path),
    createProp(data.e, propTypes.TRIM_PATH_END, path),
    createProp(data.o, propTypes.TRIM_PATH_OFFSET, path),
  ]
}

const searchPropertyInPuckerAndBloat = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.PUCKERANDBLOAT];
  return [
    createProp(data.a, propTypes.PUCKER_AND_BLOAT_AMOUNT, path),
  ]
}

const searchPropertyInTwist = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.TWIST];
  return [
    createProp(data.a, propTypes.TWIST_ANGLE, path),
    createProp(data.c, propTypes.TWIST_CENTER, path),
  ]
}

const searchPropertyInGradientStroke = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.GSTROKE];
  return [
    createProp(data.s, propTypes.GRADIENT_STROKE_START, path),
    createProp(data.e, propTypes.GRADIENT_STROKE_END, path),
    createProp(data.o, propTypes.GRADIENT_STROKE_OPACITY, path),
    createProp(data.ml2, propTypes.GRADIENT_STROKE_MITER_LIMIT, path),
    createProp(data.w, propTypes.GRADIENT_STROKE_WIDTH, path),
  ]
}

const searchPropertyInGradientFill = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.GFILL];
  return [
    createProp(data.s, propTypes.GRADIENT_FILL_START, path),
    createProp(data.e, propTypes.GRADIENT_FILL_END, path),
    createProp(data.o, propTypes.GRADIENT_FILL_OPACITY, path),
  ]
}

const searchPropertyInFill = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.FILL];
  return [
    createProp(data.c, propTypes.FILL_COLOR, path),
    createProp(data.o, propTypes.FILL_OPACITY, path),
  ]
}

const searchPropertyInZigZag = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.ZIGZAG];
  return [
    createProp(data.pt, propTypes.ZIG_ZAG_POINTS, path),
    createProp(data.r, propTypes.ZIG_ZAG_RIDGES, path),
    createProp(data.s, propTypes.ZIG_ZAG_SIZE, path),
  ]
}

const searchPropertyInStroke = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.STROKE];
  return [
    createProp(data.c, propTypes.STROKE_COLOR, path),
    createProp(data.o, propTypes.STROKE_OPACITY, path),
    createProp(data.w, propTypes.STROKE_WIDTH, path),
  ]
}

const searchPropertyInTransform = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.TRANSFORM];
  return [
    createProp(data.a, propTypes.SHAPE_TRANSFORM_ANCHOR_POINT, path),
    createProp(data.o, propTypes.SHAPE_TRANSFORM_OPACITY, path),
    createProp(data.p, propTypes.SHAPE_TRANSFORM_POSITION, path),
    createProp(data.r, propTypes.SHAPE_TRANSFORM_ROTATION, path),
    createProp(data.sa, propTypes.SHAPE_TRANSFORM_SKEW_AXIS, path),
    createProp(data.sk, propTypes.SHAPE_TRANSFORM_SKEW, path),
  ]
}

const searchPropertyInRepeater = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.REPEATER];
  return [
    createProp(data.c, propTypes.REPEATER_COPIES, path),
    createProp(data.o, propTypes.REPEATER_OFFSET, path),
    createProp(data.tr.a, propTypes.REPEATER_TRANSFORM_ANCHOR_POINT, path),
    createProp(data.tr.p, propTypes.REPEATER_TRANSFORM_POSITION, path),
    createProp(data.tr.r, propTypes.REPEATER_TRANSFORM_ROTATION, path),
    createProp(data.tr.s, propTypes.REPEATER_TRANSFORM_SCALE, path),
    createProp(data.tr.so, propTypes.REPEATER_TRANSFORM_START_OPACITY, path),
    createProp(data.tr.eo, propTypes.REPEATER_TRANSFORM_END_OPACITY, path),
  ]
}

const searchPropertyInGroup2 = (data, parentPath) => {
  const path = [...parentPath, data.nm || shapeTypes.GROUP];
  return iterateShapes(data.it, path); // eslint-disable-line no-use-before-define
}

const iterateShapes = (shapes, path) => {
  let props = [];
  const actions ={
    [shapeTypes.ELLIPSE]: searchPropertyInEllipse,
    [shapeTypes.RECT]: searchPropertyInRectangle,
    [shapeTypes.STAR]: searchPropertyInStar,
    [shapeTypes.OFFSETPATH]: searchPropertyInOffsetPaths,
    [shapeTypes.ROUNDEDCORNERS]: searchPropertyInRoundedCorners,
    [shapeTypes.TRIM]: searchPropertyInTrimPaths,
    [shapeTypes.PUCKERANDBLOAT]: searchPropertyInPuckerAndBloat,
    [shapeTypes.TWIST]: searchPropertyInTwist,
    [shapeTypes.GSTROKE]: searchPropertyInGradientStroke,
    [shapeTypes.GFILL]: searchPropertyInGradientFill,
    [shapeTypes.FILL]: searchPropertyInFill,
    [shapeTypes.ZIGZAG]: searchPropertyInZigZag,
    [shapeTypes.STROKE]: searchPropertyInStroke,
    [shapeTypes.TRANSFORM]: searchPropertyInTransform,
    [shapeTypes.REPEATER]: searchPropertyInRepeater,
    [shapeTypes.GROUP]: searchPropertyInGroup2,
  }
  let action;
  shapes.forEach(shape => {
    action = actions[shape.ty];
    if (action) {
      props = props.concat(action(shape, path));
    } else {
      // console.log('shapeshapeshapeshape', shape);
    }
  })
  return props;
}

const buildShapeProps = (layer, path) => {
  if (layer.shapes) {
    return iterateShapes(layer.shapes, path);
  }
  return [];
}

export {
  buildShapeProps,
}