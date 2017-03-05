import { createSelector } from 'reselect'

const getFonts = (state) => state.render.fonts

const renderFontSelector = createSelector(
  [ getFonts ],
  (fonts) => {
  	return fonts
  }
)

export default renderFontSelector