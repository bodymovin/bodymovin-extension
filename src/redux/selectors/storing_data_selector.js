import { createSelector } from 'reselect'

const getCompositionState = (state) => state.compositions
const getID = (state) => state.project.id
const getReports = (state) => state.reports

const storingDataSelector = createSelector(
  [ getCompositionState, getID, getReports ],
  (compositionState, id, reports) => {

  	const compositions = compositionState.items
  	return {
  		data: {
  			compositions: compositions,
  			extraState: {
				filter: compositionState.filter,
				show_only_selected: compositionState.show_only_selected,
				shouldUseCompNameAsDefault: compositionState.shouldUseCompNameAsDefault,
  			},
        reports: {
          renderers: reports.settings.renderers,
          messageTypes: reports.settings.messageTypes,
        }
  		},
  		id: id
  	}
  }
)

export default storingDataSelector