import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
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
    }
})

class Report extends React.Component {

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
      REPORTS
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

export default connect(mapStateToProps, mapDispatchToProps)(Report)
