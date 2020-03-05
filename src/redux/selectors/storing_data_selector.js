import { createSelector } from 'reselect'

const getCompositionState = (state) => state.compositions
const getID = (state) => state.project.id

const storingDataSelector = createSelector(
  [ getCompositionState, getID ],
  (compositionState, id) => {

  	const compositions = compositionState.items

  	return {
  		data: {
  			compositions: compositions,
  			extraState: {
				filter: compositionState.filter,
				show_only_selected: compositionState.show_only_selected,
				shouldUseCompNameAsDefault: compositionState.shouldUseCompNameAsDefault,
  			}
  		},
  		id: id
  	}
  }
)

export default storingDataSelector