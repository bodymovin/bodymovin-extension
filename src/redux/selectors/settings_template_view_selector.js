import { createSelector } from 'reselect'

const getItems = (state) => {
	return state.compositions.items
}
const getCurrentComp = (state) => {
	return state.compositions.current
}
const getTemplatesData = (state) => {
	return state.compositions.templates
}

const getRenderComposition = createSelector(
  [getItems, getCurrentComp, getTemplatesData ],
  (items, current, templatesData) => {
  	return {
  		data: items[current] ? items[current].settings.template : null,
			templates: templatesData.list,
		}
  }
)

export default getRenderComposition