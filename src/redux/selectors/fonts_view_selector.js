import { createSelector } from 'reselect'

const getRender = (state) => state.render

const getFontsViewData = createSelector(
	[ getRender ],
	(renderData) => {
  	return {
  		fonts: renderData.fonts,
  	}
	}
)

export default getFontsViewData