import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import PreviewViewer from './viewer/PreviewViewer'
import PreviewScrubber from './scrubber/PreviewScrubber'
import PreviewHeader from './header/PreviewHeader'
import CurrentRenders from './current_renders/CurrentRenders'
import {browsePreviewFile, updateProgress, setTotalFrames, showNoCurrentRenders, previewFromPath} from '../../redux/actions/previewActions'
import {goToComps} from '../../redux/actions/compositionActions'
import preview_view_selector from '../../redux/selectors/preview_view_selector'
import FileSaver from '../../helpers/FileSaver'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: '100%',
      padding: '10px',
      backgroundColor:'#474747'
    },
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection:'column'
    },
    header: {
      width: '100%',
      flexGrow: 0,
      flexShrink: 0
    },
    animation: {
      width: '100%',
      flexGrow: 1,
      flexShrink: 1,
      position: 'relative'
    },
    scrubber: {
      width: '100%',
      flexGrow: 0,
      flexShrink: 0
    }
})

class Preview extends React.Component {

  constructor() {
    super()
    this.updateProgress = this.updateProgress.bind(this)
    this.saveFile = this.saveFile.bind(this)
    this.itemSelected = this.itemSelected.bind(this)
    this.selectCurrentRenders = this.selectCurrentRenders.bind(this)
    this.closeSelection = this.closeSelection.bind(this)
    this.state = {
      showingCurrentRenders: false
    }
  }

  changeStart() {
    //console.log('changeStart')
  }

  updateProgress(value) {
    this.props.updateProgress(value)
  }

  saveFile(fileData) {

    var svgData = this.previewViewer.snapshot()
    FileSaver(svgData, ['svg'], 'snapshot.svg')
  }

  itemSelected(item) {
    this.props.previewFromPath(item.destination)
    this.closeSelection()
  }

  closeSelection() {
    this.setState({
      showingCurrentRenders: false
    })
  }

  selectCurrentRenders() {
    if(!this.props.previewableItems.length){
      this.props.showNoCurrentRenders()
    } else {
      this.setState({
        showingCurrentRenders: true
      })
    }
  }

  render() {
    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.container)}>
          <div className={css(styles.header)}>
            <PreviewHeader 
              browseFiles={this.props.browsePreviewFile} 
              goToComps={this.props.goToComps}
              selectCurrentRenders={this.selectCurrentRenders} />
          </div>
          <div className={css(styles.animation)}> 
            <PreviewViewer 
              animationData={this.props.preview.animationData} 
              path={this.props.preview.path} 
              renderer={this.props.renderer} 
              progress={this.props.preview.progress} 
              setTotalFrames={this.props.setTotalFrames} 
              ref={(elem => this.previewViewer = elem)} />
          </div>
          <div className={css(styles.scrubber)}> 
            <PreviewScrubber 
              updateProgress={this.updateProgress} 
              changeStart={this.changeStart} 
              totalFrames={this.props.preview.totalFrames} 
              saveFile={this.saveFile} 
              progress={this.props.preview.progress}/>
          </div>
        </div>
        {this.state.showingCurrentRenders && <CurrentRenders 
        items={this.props.previewableItems}
        cancelSelection={this.closeSelection}
        itemSelected={this.itemSelected} />}
      </div>
      );
  }
}

function mapStateToProps(state) {
  return preview_view_selector(state)
}

const mapDispatchToProps = {
  browsePreviewFile: browsePreviewFile,
  previewFromPath: previewFromPath,
  updateProgress: updateProgress,
  setTotalFrames: setTotalFrames,
  goToComps: goToComps,
  showNoCurrentRenders: showNoCurrentRenders
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview)
