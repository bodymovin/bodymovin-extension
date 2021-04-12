import { createSelector } from 'reselect'

const getPreview = (state) => state.preview

const previewLockTimelineSelector = createSelector(
	[ getPreview ],
	(preview) => {
  	return preview.shouldLockTimelineToComposition
	}
)

export default previewLockTimelineSelector