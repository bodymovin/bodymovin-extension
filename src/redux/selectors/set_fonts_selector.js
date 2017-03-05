import { createSelector } from 'reselect'

const getFonts = (state) => state.render.fonts

const setFontSelector = createSelector(
  [ getFonts ],
  (fonts) => {
  	return fonts
  }
)

export default setFontSelector