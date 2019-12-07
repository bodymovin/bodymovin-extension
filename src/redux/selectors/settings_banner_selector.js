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

  	const bannerSettings = items[current].settings.banner

  	return {
  		...bannerSettings,
  	}
  }
)

export default settingsBannerSelector