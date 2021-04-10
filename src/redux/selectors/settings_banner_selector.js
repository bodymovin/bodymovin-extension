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

  	const exportModes = items[current].settings.export_modes
  	const bannerSettings = items[current].settings.banner

  	return {
  		_isActive: exportModes.banner,
  		...bannerSettings,
  	}
	}
)

export default settingsBannerSelector