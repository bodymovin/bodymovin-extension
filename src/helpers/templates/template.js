
const validationTypes = {
  SLOTS: 'slots',
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
    } else if (slotValidation.count) {
      if (!compare(slotValidation.count.operation, matchingSlots.length, slotValidation.count.value)) {
        errors.push(errorFactory(
          validationTypes.SLOTS,
          `Slot '${slotValidation.name}' doesn't satisfy count ${slotValidation.count.operation} ${slotValidation.count.value}`,
        ));
      }
    }
  }
  return errors;
}

const validateSlots = async (data, slotsValidation) => {
  let errors = [];
  if (slotsValidation) {
    if (!data.slots) {
      errors.push(errorFactory(validationTypes.SLOTS, 'No slots on the json file'));
    }
    const slots = Object.keys(data.slots).map(slotKey => {
      return {
        ...data.slots[slotKey],
        key: slotKey,
        propertyType: searchPropertyType(data, slotKey),
      }
    });
    console.log('slots', slots);
    if (slotsValidation.ids) {
      const slotIdErrors = (await Promise.all(
        slotsValidation.ids.map(idData => {
          return validateSlot(slots, idData)
        })
      ))
      .filter(errors => errors.length > 0)
      console.log('slotIdErrors', slotIdErrors);
      errors = errors.concat(
        slotIdErrors.flat()
      )
    }
  }
  return errors;
}

const validate = async (data, parser) => {
  try {
    const validations = await Promise.all([
      validateSlots(data, parser.slots)
    ])
    const errors = validations.filter(error => error.length);
    console.log('errors', errors);
    return errors.flat();
  } catch (error) {
    throw new Error('Unhandle Error');
  }
  console.log({data, parser})
}

export default validate;