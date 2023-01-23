const createProp = (prop, type, path) => {
  return {
    prop,
    type,
    path: [...path, type].join(' > '),
  }
}

export default createProp