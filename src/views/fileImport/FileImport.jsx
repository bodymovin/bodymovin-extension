import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import {goToComps} from '../../redux/actions/compositionActions'
import {importLottieFile} from '../../redux/actions/importActions'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection:'column',
      padding: '10px 30px',
      backgroundColor :'#474747',
    },
})

class FileImport extends React.Component {

  onLottieSelect = () => {
    this.props.importLottieFile()
  }

  render() {
    return (
      <div className={css(styles.container)}>
        File Import
        <button
          style={{height:'80px', border: '1px solid'}}
          onClick={this.onLottieSelect}
        >Import Lottie
        </button>
        <button
          style={{height:'80px', border: '1px solid'}}
          onClick={this.props.goToComps}
        >Back
        </button>
      </div>
      );
  }
}
const mapDispatchToProps = {
  importLottieFile: importLottieFile,
  goToComps: goToComps,
}

export default connect(null, mapDispatchToProps)(FileImport)
