import { createSelector } from 'reselect'

const getCompositionState = (state) => state.compositions
const getPreviewState = (state) => state.preview
const getID = (state) => state.project.id

const storingDataSelector = createSelector(
  [ getCompositionState, getPreviewState, getID ],
  (compositionState, previewState, id) => {

  	const compositions = compositionState.items

  	return {
  		data: {
  			compositions: compositions,
  			extraState: {
				filter: compositionState.filter,
				show_only_selected: compositionState.show_only_selected,
				shouldUseCompNameAsDefault: compositionState.shouldUseCompNameAsDefault,
  			},
        preview: {
          backgroundColor: previewState.backgroundColor,
        }
  		},
  		id: id
  	}
  }
)

export default storingDataSelector