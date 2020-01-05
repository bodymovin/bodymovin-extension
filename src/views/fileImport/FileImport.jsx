import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import ImportHeader from '../../components/header/Import_header'
import {goToComps} from '../../redux/actions/compositionActions'
import {
  importLottieFile,
  importLottieFileFromUrl,
  lottieProcessCancel,
  importLeave,
} from '../../redux/actions/importActions'
import fileImportSelector from '../../redux/selectors/file_import_selector'
import Variables from '../../helpers/styles/variables'
// import BaseButton from '../../components/buttons/Base_button'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      padding: '10px 30px',
      backgroundColor :'#474747',
    },
    body: {
      backgroundColor: Variables.colors.gray_darkest,
      width: '100%',
      padding: '10px',
    },
    body_message: {
      color: '#ffffff',
      padding: '10px',
      width: '100%',
    }
})

class FileImport extends React.Component {

  constructor(props) {
    super(props)
    this.buildProcessingMessage = this.buildProcessingMessage.bind(this)
    this.buildIdleMessage = this.buildIdleMessage.bind(this)
    this.state = {
      // urlImportValue: 'http://lab.nearpod.com/bodymovin/demo/imports/1/acomp1.json'
      // urlImportValue: 'https://assets7.lottiefiles.com/packages/lf20_uexbYU.json'
      // urlImportValue: 'https://assets10.lottiefiles.com/packages/lf20_KAeP3q.json'
    }
  }

  handleUrlImportChange = (value) => {
    this.setState({
      urlImportValue: value
    })
  }

  handleUrlImportSubmit = () => {
    this.props.importLottieFileFromUrl(this.state.urlImportValue)
  }

  onLottieSelect = () => {
    this.props.importLottieFile()
  }

  message = {
    idle: this.buildIdleMessage,
    processing: this.buildProcessingMessage,
    ended: this.buildEndMessage,
  }

  buildEndMessage(props) {
    return (
      <div>
        ENDED
      </div>
    )
  }

  buildProcessingMessage(props) {
    return (
      <div>
        Pending Commands: {props.pendingCommands}
      </div>
    )
  }

  buildIdleMessage(props) {
    return (
      <div>
        IDLE
      </div>
    )
  }

  buildMessage(state) {
    return this.message[state](this.props)
  }

  render() {

    return (
      <div className={css(styles.container)}>
        <ImportHeader 
          onSelect={this.onLottieSelect}
          onBack={this.props.goToComps}
          onCancel={this.props.lottieProcessCancel}
          state={this.props.state}
          urlImportValue={this.state.urlImportValue}
          handleUrlImportChange={this.handleUrlImportChange}
          onUrlImportSubmit={this.handleUrlImportSubmit}
        />
        <div className={css(styles.body)}>
          <div className={css(styles.body_message)}>
            {this.buildMessage(this.props.state)}
          </div>
        </div>
        <div>
      </div>
    </div>
    );
  }

  componentWillUnmount() {
    console.log('UNMOUNT')
    this.props.importLeave()
  }

}


const mapStateToProps = (state) => fileImportSelector(state)

const mapDispatchToProps = {
  importLottieFile: importLottieFile,
  importLottieFileFromUrl: importLottieFileFromUrl,
  lottieProcessCancel: lottieProcessCancel,
  importLeave: importLeave,
  goToComps: goToComps,
}

export default connect(mapStateToProps, mapDispatchToProps)(FileImport)
