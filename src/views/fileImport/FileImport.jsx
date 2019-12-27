import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
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
          onClick={this.onLottieSelect}
        >Import Lottie
        </button>
      </div>
      );
  }
}
const mapDispatchToProps = {
  importLottieFile: importLottieFile
}

export default connect(null, mapDispatchToProps)(FileImport)
