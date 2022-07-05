import { createSelector } from 'reselect'

const getCompositionState = (state) => state.compositions
const getPreviewState = (state) => state.preview
const getID = (state) => state.project.id
const getReports = (state) => state.reports
const getName = (state) => state.project.name

const storingDataSelector = createSelector(
  [ getCompositionState, getPreviewState, getID, getReports, getName ],
  (compositionState, previewState, id, reports, name) => {

  	const compositions = compositionState.items
  	return {
  		data: {
  			compositions: compositions,
  			extraState: {
					filter: compositionState.filter,
					show_only_selected: compositionState.show_only_selected,
					shouldUseCompNameAsDefault: compositionState.shouldUseCompNameAsDefault,
					shouldUseAEPathAsDestinationFolder: compositionState.shouldUseAEPathAsDestinationFolder,
					shouldUsePathAsDefaultFolder: compositionState.shouldUsePathAsDefaultFolder,
					shouldIncludeCompNameAsFolder: compositionState.shouldIncludeCompNameAsFolder,
					defaultFolderPath: compositionState.defaultFolderPath,
					shouldKeepCopyOfSettings: compositionState.shouldKeepCopyOfSettings,
					settingsDestinationCopy: compositionState.settingsDestinationCopy,
					shouldSaveInProjectFile: compositionState.shouldSaveInProjectFile,
					shouldSkipDoneView: compositionState.shouldSkipDoneView,
					shouldReuseFontData: compositionState.shouldReuseFontData,
  			},
        reports: {
          renderers: reports.settings.renderers,
          messageTypes: reports.settings.messageTypes,
          builders: reports.settings.builders,
        },
        preview: {
          backgroundColor: previewState.backgroundColor,
          shouldLockTimelineToComposition: previewState.shouldLockTimelineToComposition,
        },
				name: name, 
  		},
  		id: id,
  	}
  }
)

export default storingDataSelector