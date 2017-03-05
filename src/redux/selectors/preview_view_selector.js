import { createSelector } from 'reselect'

const getPreview = (state) => state.preview
const getCompositions = (state) => state.compositions

const previewViewSelector = createSelector(
  [ getPreview, getCompositions ],
  (preview, compositions) => {
  	let totalFrames
  	if(preview.animationData) {
  		totalFrames = preview.animationData.op - preview.animationData.ip
  	} else {
  		totalFrames = 1
  	}

    let previewableItems = compositions.list.filter(function(id){
      return compositions.items[id].renderStatus === 1 && compositions.items[id].settings.standalone === false
    }).map(function(id){
        return compositions.items[id]
    })

  	return {
  		preview: preview,
      totalFrames: totalFrames,
  		previewableItems: previewableItems
  	}
  }
)

export default previewViewSelector