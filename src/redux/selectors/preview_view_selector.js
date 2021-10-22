import { createSelector } from 'reselect'

const getPreview = (state) => state.preview
const getCompositions = (state) => state.compositions

function getRenderer(animationData) {
  var i = 0, len = animationData.layers.length;
  while(i < len){
    if(animationData.layers[i].ddd) {
      return 'html'
    }
    i += 1;

  }
  return 'svg'
}

const previewViewSelector = createSelector(
  [ getPreview, getCompositions ],
  (preview, compositions) => {
  	let totalFrames, renderer, frameRate
  	if(preview.animationData) {
      totalFrames = preview.animationData.op - preview.animationData.ip
      frameRate = preview.animationData.fr
      renderer = getRenderer(preview.animationData)
  	} else {
      renderer = 'svg'
      totalFrames = 1
  		frameRate = 1
  	}

    let previewableItems = compositions.list.filter(function(id){
      return compositions.items[id].renderStatus === 1 && compositions.items[id].settings.export_modes.standard
    }).map(function(id){
        return compositions.items[id]
    })

  	return {
  		preview: preview,
      totalFrames: totalFrames,
      frameRate: frameRate,
      renderer: renderer,
      previewableItems: previewableItems,
      backgroundColor: preview.backgroundColor,
      timelineData: preview.timelineData,
      shouldLockTimelineToComposition: preview.shouldLockTimelineToComposition,
  		shouldLoop: preview.shouldLoop,
  	}
  }
)

export default previewViewSelector