import slotRuleTypes from "../enums/slotRuleTypes";
import validationTypes from "../enums/validationTypes";
import compare from "../helpers/compareOperation";
import errorFactory from "../helpers/errorFactory";
import buildProps from "./layers/layer";
import { addPropToSlot } from "./props";

const mapSlotsWithProperties = (animationProps) => {
  const slotProps = {}
  animationProps.forEach(propData => {
    if (propData.prop.sid) {
      addPropToSlot(propData.prop.sid, propData.type, slotProps);
    }
  })
  return slotProps;
}

const validateSlot = async (slots, slotValidation) => {
  const templateError = errorFactory();
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
      templateError.add(
        validationTypes.SLOTS,
        `Missing slot with name '${slotValidation.name}'`,
      );
    } else {
      if (slotValidation.count) {
        if (!compare(slotValidation.count.operation, matchingSlots.length, slotValidation.count.value)) {
          templateError.add(
            validationTypes.SLOTS,
            `Slot '${slotValidation.name}' doesn't satisfy count ${slotValidation.count.operation} ${slotValidation.count.value}`,
          );
        }
      }
      if (slotValidation.property) {
        matchingSlots.forEach(match => {
          console.log('match', match);
          if (match.mappedProperties.indexOf(slotValidation.property) === -1) {
            templateError.add(
              validationTypes.SLOTS,
              `Slot '${slotValidation.name}' is not applied to the correct property '${slotValidation.property}'; it is applied to '${match.mappedProperties.join()}' instead`,
            );
          }
        })
      }
    }
  }
  return templateError;
}

const validateEntries = async (entries, slots, animationProps) => {
  const templateError = errorFactory();
  if (entries) {
    (await Promise.all(
      entries.map(entryData => {
        return validateSlot(slots, entryData, animationProps)
      })
    ))
    .forEach(templateError.concat)
  }
  return templateError;

}

const validateRules = async(rules, animationProps) => {
  const templateError = errorFactory();
  if (rules) {
    rules.forEach(rule => {
      if (rule.type === slotRuleTypes.ASSIGNED) {
        if (rule.properties && rule.properties.length) {
          animationProps.forEach(animationProp => {
            if (rule.properties.includes(animationProp.type) && !animationProp.prop.sid) {
              templateError.add(validationTypes.SLOTS, `Property in path '${animationProp.path}' is not assigned to a slot`);
            }
          })
        }
      }
    })
  }
  return templateError;
}

const validateSlots = async (data, slotsValidation) => {
  const templateError = errorFactory();
  if (slotsValidation) {
    const animationProps = buildProps(data);
    if (!data.slots) {
      templateError.add(validationTypes.SLOTS, 'No slots on the json file');
    } else {
      const slotPropertyMap = mapSlotsWithProperties(animationProps);
      const slots = Object.keys(data.slots).map(slotKey => {
        return {
          ...data.slots[slotKey],
          key: slotKey,
          mappedProperties: slotPropertyMap[slotKey],
        }
      });
      (await Promise.all(
        [
          validateEntries(slotsValidation.entries, slots, animationProps),
          validateRules(slotsValidation.rules, animationProps),
        ]
      ))
      .forEach(templateError.concat)
    }
  }
  return templateError;
}

export default validateSlots;
