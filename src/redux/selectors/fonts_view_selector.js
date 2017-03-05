import { createSelector } from 'reselect'

const getFonts = (state) => state.render.fonts

const getFontsViewData = createSelector(
  [ getFonts ],
  (fonts) => {
  	return {
  		fonts: fonts
  	}
  }
)

export default getFontsViewData