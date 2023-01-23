import layerTypes from "../../enums/layerTypes";
import propTypes from "../../enums/propTypes";
import createProp from "../../helpers/propFactory";
import { buildShapeProps } from "./shapes";

const buildLayerProps = (layer, parentPath) => {
  const path = [...parentPath, layer.nm]
  let props = [];
  if (layer.ks) {
    if(layer.ks.s) {
      props.push(createProp(layer.ks.s, propTypes.SCALE, path))
    }
    if(layer.ks.p) {
      if (!layer.ks.p.s) {
        props.push(createProp(layer.ks.p, propTypes.POSITION, path))
      } else {
        if (layer.ks.p.x) {
          props.push(createProp(layer.ks.p.x, propTypes.POSITION_X, path))
        }
        if (layer.ks.p.y) {
          props.push(createProp(layer.ks.p.y, propTypes.POSITION_Y, path))
        }
      }
    }
    if(layer.ks.r) {
      props.push(createProp(layer.ks.r, propTypes.ROTATION, path))
    }
    if(layer.ks.o) {
      props.push(createProp(layer.ks.o, propTypes.OPACITY, path))
    }
    if(layer.ks.a) {
      props.push(createProp(layer.ks.a, propTypes.ANCHOR_POINT, path))
    }
  }
  if (layer.ty === layerTypes.SHAPE) {
    props = props.concat(buildShapeProps(layer, path))
  }
  return props;
}

const buildLayersProps = (layers, path) => {
  let props = [];
  layers.forEach(layer => {
    props = [
      ...props,
      ...buildLayerProps(layer, path),
    ]
  })
  return props;
}

const buildProps = (data, path = []) => {
  let props = [];
  if (data.layers) {
    props = props.concat(buildLayersProps(data.layers, path))
  }
  if (data.assets) {
    data.assets.forEach(asset => {
      if (asset.layers) {
        props = props.concat(buildLayersProps(asset.layers, [...path, asset.nm || 'Comp']))
      }
    })
  }
  return props;
}

export default buildProps;

