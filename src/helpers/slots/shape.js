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
}


const convertRectangle = (shape, slots, properties) => {
  convertProperty(shape.p, slots, properties);
  convertProperty(shape.r, slots, properties);
  convertProperty(shape.s, slots, properties);
}

const convertEllipse = (shape, slots, properties) => {
  convertProperty(shape.p, slots, properties);
  convertProperty(shape.s, slots, properties);
}

const convertStar = (shape, slots, properties) => {
  convertProperty(shape.ir, slots, properties);
  convertProperty(shape.is, slots, properties);
  convertProperty(shape.or, slots, properties);
  convertProperty(shape.os, slots, properties);
  convertProperty(shape.p, slots, properties);
  convertProperty(shape.r, slots, properties);
  convertProperty(shape.pt, slots, properties);
}

const convertGroup = (shape, slots, properties) => {
  // eslint-disable-next-line no-use-before-define
  iterateShapes(shape.it, slots, properties);
  console.log('shape.it', shape.it);
}

const convertOffset = (shape, slots, properties) => {
  convertProperty(shape.a, slots, properties);
  convertProperty(shape.ml, slots, properties);
}

const convertPuckerAndBloat = (shape, slots, properties) => {
  convertProperty(shape.a, slots, properties);
}

const convertRoundedCorners = (shape, slots, properties) => {
  convertProperty(shape.r, slots, properties);
}

const convertTrimPaths = (shape, slots, properties) => {
  convertProperty(shape.s, slots, properties);
  convertProperty(shape.e, slots, properties);
  convertProperty(shape.o, slots, properties);
}

const convertTwist = (shape, slots, properties) => {
  convertProperty(shape.a, slots, properties);
  convertProperty(shape.c, slots, properties);
}

const convertGradientStroke = (shape, slots, properties) => {
  convertProperty(shape.e, slots, properties);
  convertProperty(shape.g, slots, properties);
  convertProperty(shape.ml2, slots, properties);
  convertProperty(shape.o, slots, properties);
  convertProperty(shape.s, slots, properties);
}

const convertGradientFill = (shape, slots, properties) => {
  convertProperty(shape.e, slots, properties);
  convertProperty(shape.g, slots, properties);
  convertProperty(shape.o, slots, properties);
  convertProperty(shape.s, slots, properties);
}

const convertFill = (shape, slots, properties) => {
  convertProperty(shape.c, slots, properties);
  convertProperty(shape.o, slots, properties);
}

const convertStroke = (shape, slots, properties) => {
  convertProperty(shape.c, slots, properties);
  convertProperty(shape.o, slots, properties);
  convertProperty(shape.w, slots, properties);
}

const convertRepeater = (shape, slots, properties) => {
  convertProperty(shape.o, slots, properties);
  convertTransform(shape.tr, slots, properties);
}

const convertPath = (shape, slots, properties) => {
  convertTransform(shape.ks, slots, properties);
}

const convertZigZag = (shape, slots, properties) => {
  convertProperty(shape.s, slots, properties);
  convertProperty(shape.r, slots, properties);
  convertProperty(shape.pt, slots, properties);
}

const convertGeneric = (shape, slots, properties) => {
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
}

const iterateShapes = (shapes, slots, properties) => {
  shapes.forEach((shapeProperty) => {
    if (shapePropConverters[shapeProperty.ty]) {
      shapePropConverters[shapeProperty.ty](shapeProperty, slots, properties)
    }  else {
      console.log('TYPE MISSING', shapeProperty.ty);
    }
  })
}

const convertShape = (shape, slots, properties) => {
  iterateShapes(shape.shapes, slots, properties);
}

export default convertShape;