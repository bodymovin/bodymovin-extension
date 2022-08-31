import { createSelector } from 'reselect'

const getCompNamesAsDefault = (state) => state.compositions.shouldUseCompNameAsDefault
const getAEAsPath = (state) => state.compositions.shouldUseAEPathAsDestinationFolder
const getDefaultPathAsFolder = (state) => state.compositions.shouldUsePathAsDefaultFolder
const getDefaultFolderPath = (state) => state.compositions.defaultFolderPath
const getShouldIncludeCompNameAsFolder = (state) => state.compositions.shouldIncludeCompNameAsFolder
const getShouldKeepSettingsCopy = (state) => state.compositions.shouldKeepCopyOfSettings
const getSettingsDestinationCopy = (state) => state.compositions.settingsDestinationCopy
const getShouldSaveInProjectFile = (state) => state.compositions.shouldSaveInProjectFile
const getShouldSkipDoneView = (state) => state.compositions.shouldSkipDoneView
const getShouldReuseFontData = (state) => state.compositions.shouldReuseFontData

const getCompositionsList = createSelector(
  [
    getCompNamesAsDefault,
    getAEAsPath,
    getDefaultPathAsFolder,
    getDefaultFolderPath,
    getShouldIncludeCompNameAsFolder,
    getShouldKeepSettingsCopy,
    getSettingsDestinationCopy,
    getShouldSaveInProjectFile,
    getShouldSkipDoneView,
    getShouldReuseFontData,
  ],
  (
    shouldUseCompNameAsDefault,
    shouldUseAEPathAsDestinationFolder,
    shouldUsePathAsDefaultFolder,
    defaultFolderPath,
    shouldIncludeCompNameAsFolder,
    shouldKeepCopyOfSettings,
    settingsDestinationCopy,
    shouldSaveInProjectFile,
    shouldSkipDoneView,
    shouldReuseFontData,
  ) => {
  	return {
      shouldUseCompNameAsDefault: shouldUseCompNameAsDefault,
      shouldUseAEPathAsDestinationFolder: shouldUseAEPathAsDestinationFolder,
      shouldUsePathAsDefaultFolder: shouldUsePathAsDefaultFolder,
      defaultFolderPath: defaultFolderPath,
      shouldIncludeCompNameAsFolder: shouldIncludeCompNameAsFolder,
      shouldKeepCopyOfSettings: shouldKeepCopyOfSettings,
      settingsDestinationCopy: settingsDestinationCopy,
      shouldSaveInProjectFile: shouldSaveInProjectFile,
      shouldSkipDoneView: shouldSkipDoneView,
      shouldReuseFontData: shouldReuseFontData,
  	}
  }
)

export default getCompositionsList