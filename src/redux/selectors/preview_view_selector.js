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
  	let totalFrames, renderer
  	if(preview.animationData) {
  		totalFrames = preview.animationData.op - preview.animationData.ip
      renderer = getRenderer(preview.animationData)
  	} else {
      renderer = 'svg'
  		totalFrames = 1
  	}

    console.log(compositions.items)

    let previewableItems = compositions.list.filter(function(id){
      return compositions.items[id].renderStatus === 1 && compositions.items[id].settings.export_modes.standard
    }).map(function(id){
        return compositions.items[id]
    })

  	return {
  		preview: preview,
      totalFrames: totalFrames,
      renderer: renderer,
  		previewableItems: previewableItems
  	}
  }
)

export default previewViewSelector