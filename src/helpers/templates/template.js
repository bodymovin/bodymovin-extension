
const validationTypes = {
  SLOTS: 'slots',
  ASSETS: 'assets',
}

const compare = (operation, left, right) => {
  switch (operation) {
    case '>=':
      return left >= right;
    case '>':
      return left > right;
    case '===':
      return left === right;
    case '==':
      return left == right;
    case '<':
      return left < right;
    case '<=':
      return left <= right;
    default: 
      return true;
  }
}

const errorFactory = (type, message) => {
  return {
    type,
    message,
  }
}

const searchPropertyInLayer = (layers, propertyId) => {
  let property = null;
  
  return property;
}

const searchPropertyInLayers = (layers, propertyId) => {
  let i = 0;
  let property = '';
  while (i < layers.length) {
    property = searchPropertyInLayer(layers[i], propertyId);
    if (property) {
      break;
    }
    i += 1;
  }
  return property;
}

const searchPropertyInAssets = (assets, propertyId) => {
  return '';
}

const searchPropertyType = (animationData, propertyId) => {
  let propertyType = 'Unknown';
  if (animationData.layers) {
    propertyType = searchPropertyInLayers(animationData.layers, propertyId) || propertyType;
  }
  if (!propertyType && animationData.assets) {
    propertyType = searchPropertyInAssets(animationData.assets, propertyId) || propertyType;
  }
  return propertyType;
}

const validateSlot = async (slots, slotValidation) => {
  const errors = [];
  if (slotValidation.name) {
    const matchingSlots = slots.filter(slot => {
      if (slotValidation.type === 'regex') {
        const slotRegex = new RegExp(slotValidation.name);
        if (slotRegex.exec(slot.key)) {
          return true;
        }
      } else if (slotValidation.name === slot.key) {
        return true;
      }
      return false;
    })
    if (!matchingSlots.length) {
      errors.push(errorFactory(
        validationTypes.SLOTS,
        `Missing slot with name '${slotValidation.name}'`,
      ));
    } else {
      if (slotValidation.count) {
        if (!compare(slotValidation.count.operation, matchingSlots.length, slotValidation.count.value)) {
          errors.push(errorFactory(
            validationTypes.SLOTS,
            `Slot '${slotValidation.name}' doesn't satisfy count ${slotValidation.count.operation} ${slotValidation.count.value}`,
          ));
        }
      }
      if (slotValidation.property) {
        matchingSlots.forEach(match => {
          if (match.mappedProperties.indexOf(slotValidation.property) === -1) {
            errors.push(errorFactory(
              validationTypes.SLOTS,
              `Slot '${slotValidation.name}' is not applied to the correct property '${slotValidation.property}'; it is applied to '${match.mappedProperties.join()}' instead`,
            ));
          }
        })
      }
    }
  }
  return errors;
}

const mapSlotsWithProperties = (animationData) => {
  const slots = {}
  const addPropToSlot = (slotId, propertyType) => {
    if (!slots[slotId]) {
      slots[slotId] = [];
    }
    if (slots[slotId].indexOf(propertyType) === -1) {
      slots[slotId].push(propertyType);
    }
  }
  const searchPropsInLayer = (layer) => {
    if (layer.ks) {
      if (layer.ks.p && layer.ks.p.pid) {
        addPropToSlot(layer.ks.p.pid, 'position');
      }
      if (layer.ks.s && layer.ks.p.pid) {
        addPropToSlot(layer.ks.s.pid, 'scale');
      }
      if (layer.ks.r && layer.ks.r.pid) {
        addPropToSlot(layer.ks.r.pid, 'rotation');
      }
      if (layer.ks.o && layer.ks.o.pid) {
        addPropToSlot(layer.ks.o.pid, 'opacity');
      }
      if (layer.ks.a && layer.ks.a.pid) {
        addPropToSlot(layer.ks.a.pid, 'anchor');
      }
    }
  }
  if (animationData.layers) {
    animationData.layers.forEach(searchPropsInLayer)
  }
  if (animationData.assets) {
    animationData.assets.forEach(asset => {
      if (asset.layers) {
        asset.layers.forEach(searchPropsInLayer)
      }
    })
  }
  return slots;
}

const validateSlots = async (data, slotsValidation) => {
  let errors = [];
  if (slotsValidation) {
    if (!data.slots) {
      errors.push(errorFactory(validationTypes.SLOTS, 'No slots on the json file'));
    } else {
      const slotPropertyMap = mapSlotsWithProperties(data);
      const slots = Object.keys(data.slots).map(slotKey => {
        return {
          ...data.slots[slotKey],
          key: slotKey,
          propertyType: searchPropertyType(data, slotKey),
          mappedProperties: slotPropertyMap[slotKey],
        }
      });
      if (slotsValidation.entries) {
        const slotIdErrors = (await Promise.all(
          slotsValidation.entries.map(entryData => {
            return validateSlot(slots, entryData)
          })
        ))
        .filter(errors => errors.length > 0)
        errors = errors.concat(
          slotIdErrors.flat()
        )
      }
    }
  }
  return errors;
}

const validateAssets = (animationData, assetsValidation) => {
  let errors = [];
  if (assetsValidation) {
    const assets = animationData.assets
      ? animationData.assets.filter(asset => !asset.layers)
      : []
    if (assetsValidation.count) {
      if (!compare(assetsValidation.count.operation, assets.length, assetsValidation.count.value)) {
        errors.push(errorFactory(
          validationTypes.ASSETS,
          `Total assets (${assets.length}) don't satisfy count ${assetsValidation.count.operation} ${assetsValidation.count.value}`,
        ));
      }
    }
  }
  return errors;
}

const validate = async (data, parser) => {
  try {
    const validations = await Promise.all([
      validateSlots(data, parser.slots),
      validateAssets(data, parser.assets),
    ])
    const errors = validations.filter(error => error.length);
    return errors.flat();
  } catch (error) {
    throw new Error('Unhandle Error');
  }
}

export default validate;