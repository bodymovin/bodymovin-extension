import { createSelector } from 'reselect'

const getItems = (state) => {
	return state.compositions.items
}

const getCurrentComp = (state) => {
	return state.compositions.current
}

const settingsBannerSelector = createSelector(
	[getItems, getCurrentComp ],
	(items, current) => {

  	const item = items[current]
  	const exportModes = item.settings.export_modes

  	return {
  		_isActive: exportModes.demo,
  		backgroundColor: item.settings.demoData.backgroundColor,
  	}
	}
)

export default settingsBannerSelector