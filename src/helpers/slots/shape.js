import convertProperty from "./property";
import convertTransform from "./transform";

const shapeTypes = {
  GROUP: 'gr',
  RECTANGLE: 'rc',
  ELLIPSE: 'el',
  STAR: 'sr',
  OFFSET: 'op',
  PUCKER_AND_BLOAT: 'pb',
  ROUNDED_CORNERS: 'rd',
  TRIM_PATHS: 'tm',
  TWIST: 'tw',
  GRADIENT_STROKE: 'gs',
  GRADIENT_FILL: 'gf',
  FILL: 'fl',
  STROKE: 'st',
  REPEATER: 'rp',
  SHAPE: 'sh',
  ZIGZAG: 'zz',
  TRANSFORM: 'tr',
  MERGE_PATH: 'mm',
}


const convertRectangle = (shape, props, properties) => {
  convertProperty(shape.p, props, properties);
  convertProperty(shape.r, props, properties);
  convertProperty(shape.s, props, properties);
}

const convertEllipse = (shape, props, properties) => {
  convertProperty(shape.p, props, properties);
  convertProperty(shape.s, props, properties);
}

const convertStar = (shape, props, properties) => {
  convertProperty(shape.ir, props, properties);
  convertProperty(shape.is, props, properties);
  convertProperty(shape.or, props, properties);
  convertProperty(shape.os, props, properties);
  convertProperty(shape.p, props, properties);
  convertProperty(shape.r, props, properties);
  convertProperty(shape.pt, props, properties);
}

const convertGroup = (shape, props, properties) => {
  // eslint-disable-next-line no-use-before-define
  iterateShapes(shape.it, props, properties);
}

const convertOffset = (shape, props, properties) => {
  convertProperty(shape.a, props, properties);
  convertProperty(shape.ml, props, properties);
}

const convertPuckerAndBloat = (shape, props, properties) => {
  convertProperty(shape.a, props, properties);
}

const convertRoundedCorners = (shape, props, properties) => {
  convertProperty(shape.r, props, properties);
}

const convertTrimPaths = (shape, props, properties) => {
  convertProperty(shape.s, props, properties);
  convertProperty(shape.e, props, properties);
  convertProperty(shape.o, props, properties);
}

const convertTwist = (shape, props, properties) => {
  convertProperty(shape.a, props, properties);
  convertProperty(shape.c, props, properties);
}

const convertGradientStroke = (shape, props, properties) => {
  convertProperty(shape.e, props, properties);
  convertProperty(shape.g, props, properties);
  convertProperty(shape.ml2, props, properties);
  convertProperty(shape.o, props, properties);
  convertProperty(shape.s, props, properties);
}

const convertGradientFill = (shape, props, properties) => {
  convertProperty(shape.e, props, properties);
  convertProperty(shape.g, props, properties);
  convertProperty(shape.o, props, properties);
  convertProperty(shape.s, props, properties);
}

const convertFill = (shape, props, properties) => {
  convertProperty(shape.c, props, properties);
  convertProperty(shape.o, props, properties);
}

const convertStroke = (shape, props, properties) => {
  convertProperty(shape.c, props, properties);
  convertProperty(shape.o, props, properties);
  convertProperty(shape.w, props, properties);
}

const convertRepeater = (shape, props, properties) => {
  convertProperty(shape.o, props, properties);
  convertTransform(shape.tr, props, properties);
}

const convertPath = (shape, props, properties) => {
  convertProperty(shape.ks, props, properties);
}

const convertZigZag = (shape, props, properties) => {
  convertProperty(shape.s, props, properties);
  convertProperty(shape.r, props, properties);
  convertProperty(shape.pt, props, properties);
}

const convertMergePath = () => {
  // Nothing to convert on merge paths
}

const convertGeneric = (shape, props, properties) => {
  console.log('GENERIC', shape)
}

const shapePropConverters = {
  [shapeTypes.RECTANGLE]:  convertRectangle,
  [shapeTypes.ELLIPSE]:  convertEllipse,
  [shapeTypes.STAR]:  convertStar,
  [shapeTypes.GROUP]:  convertGroup,
  [shapeTypes.OFFSET]:  convertOffset,
  [shapeTypes.PUCKER_AND_BLOAT]:  convertPuckerAndBloat,
  [shapeTypes.ROUNDED_CORNERS]:  convertRoundedCorners,
  [shapeTypes.TRIM_PATHS]:  convertTrimPaths,
  [shapeTypes.TWIST]:  convertTwist,
  [shapeTypes.GRADIENT_STROKE]:  convertGradientStroke,
  [shapeTypes.GRADIENT_FILL]:  convertGradientFill,
  [shapeTypes.FILL]:  convertFill,
  [shapeTypes.STROKE]:  convertStroke,
  [shapeTypes.REPEATER]:  convertRepeater,
  [shapeTypes.SHAPE]:  convertPath,
  [shapeTypes.ZIGZAG]:  convertZigZag,
  [shapeTypes.TRANSFORM]:  convertTransform,
  [shapeTypes.MERGE_PATH]:  convertMergePath,
}

const iterateShapes = (shapes, props, properties) => {
  shapes.forEach((shapeProperty) => {
    if (shapePropConverters[shapeProperty.ty]) {
      shapePropConverters[shapeProperty.ty](shapeProperty, props, properties)
    }  else {
      console.log('TYPE MISSING', shapeProperty.ty);
    }
  })
}

const convertShape = (shape, props, properties) => {
  iterateShapes(shape.shapes, props, properties);
}

export default convertShape;