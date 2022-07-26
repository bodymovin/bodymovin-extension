import { createSelector } from 'reselect'

const getTemplateSettings = (state) => state.compositions.templates

const getCompositionsList = createSelector(
  [
    getTemplateSettings,
  ],
  (
    templateSettings,
  ) => {
  	return {
      templates: templateSettings,
  	}
  }
)

export default getCompositionsList