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
import {openInBrowser} from '../../helpers/CompositionsProvider'
import GradientAlert from './alerts/GradientAlert'
import RegularAlert from './alerts/RegularAlert'
// import BaseButton from '../../components/buttons/Base_button'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px 30px 30px 30px',
      backgroundColor :'#474747',
    },
    body: {
      backgroundColor: Variables.colors.gray_darkest,
      width: '100%',
      padding: '10px',
      flex: '1 1 auto',
      overflow: 'auto',
    },
    body_message: {
      color: '#ffffff',
      padding: '10px',
      width: '100%',
    },
    alerts: {
      color: '#ffffff',
      marginTop: '10px',
      padding: '10px 0',
      width: '100%',
    },
    alert_title: {
      fontSize: '20px',
    },
    alert_message: {
      color: '#ffffff',
      marginTop: '10px',
      padding: '10px',
      width: '100%',
      border: '1px solid #ffffff',
    },
    alert_message_text: {
      marginBottom: '4px',
    },
    alert_message_label: {
      fontSize: '14px',
    },
    idle_message: {
      color: '#ffffff',
      marginTop: '10px',
      padding: '10px',
      width: '100%',
      border: '1px solid #ffffff',
    },
    idle_note: {
      fontSize: '14px',
      lineHeight: '18px',
      marginTop: '10px',
    },
    processing_message: {
      color: '#ffffff',
      fontSize: '12px',
      lineHeight: '14px',
      marginTop: '10px',
      width: '100%',
    },
    processing_image_container: {
      marginTop: '10px',
      width: '100%',
      textAlign:'center',
    },
    processing_image: {
      maxWidth: '100%',
    },
    processing_cat_fact_container: {
      padding: '20px',
      minHeight: '40px',
    },
    processing_cat_fact_title: {
      fontWeight: 900,
      fontSize: '14px',
      letterSpacing: '0.1px',
      marginBottom: '4px',
    },
    processing_cat_fact: {
      backgroundColor: '#fff',
      padding: '20px 0',
      color: Variables.colors.gray_darkest,
      fontWeight: 900,
      fontSize: '16px',
      lineHeight: '18px',
      textAlign: 'center',
    },
    link: {
      color: Variables.colors.green
    },
})

class FileImport extends React.Component {

  constructor(props) {
    super(props)
    this.buildProcessingMessage = this.buildProcessingMessage.bind(this)
    this.buildIdleMessage = this.buildIdleMessage.bind(this)
    this.buildEndMessage = this.buildEndMessage.bind(this)
    this.buildFailedMessage = this.buildFailedMessage.bind(this)
    this.state = {
      urlImportValue: 'https://',
    }
    this.message = {
      idle: this.buildIdleMessage,
      processing: this.buildProcessingMessage,
      loading: this.buildLoadingMessage,
      ended: this.buildEndMessage,
      failed: this.buildFailedMessage,
    }
    this.alertTypes = {
      message: this.buildAlert,
      gradient: this.buildGradientAlert,
    }
  }

  openInBrowser(){
    openInBrowser('https://github.com/airbnb/lottie-web/issues')
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

  buildGradientAlert(alertData) {
    return <GradientAlert data={alertData} />
  }

  buildAlert(alertData) {
    return <RegularAlert data={alertData} />
  }

  buildAlertMessages(alerts) {
    if(alerts && alerts.length) {
      return (
        <div className={css(styles.alerts)}>
          <div className={css(styles.alert_title)}>Alerts</div>
          <div>
          {alerts.map((message, index) => {
            return (
              <div
                key={index}
              >
                {this.alertTypes[message.type](message)}
              </div>
            )
          })}
          </div>
        </div>
       )
    } else {
      return null;
    }
  }

  buildEndMessage(props) {
    return (
      <div>
        <div>Import Finished</div>
        {this.buildAlertMessages(props.messages)}
        
      </div>
    )
  }

  buildFailedMessage(props) {
    return (
      <div>
        <div>Import Failed</div>
        {this.buildAlertMessages(props.messages)}
        
      </div>
    )
  }

  buildProcessingMessage(props) {
    return (
      <div>
        <div className={css(styles.alert_message)}>
          <span>
            Pending Commands: {props.pendingCommands}
          </span>
          <br/>
          <span>
            Estimated remaining time: {Math.ceil(props.pendingCommands * 50 / 1000)} seconds
          </span>
        </div>
        <div className={css(styles.processing_message)}>
          {!!props.image.img_src && 
            <div>
              <div>
                Here is a picture from Mars
              </div>
              <div className={css(styles.processing_image_container)}>
                <img 
                  className={css(styles.processing_image)}
                  src={props.image.img_src} 
                  alt={'mars ' + (props.image.earth_date || '')}
                />
              </div>
            </div>
          }
          {!!props.fact.text && 
            <div>
              <div className={css(styles.processing_cat_fact_container)}>
                <div className={css(styles.processing_cat_fact_title)}>
                  This process might take some time. Here is a cat fact.
                </div>
                <div className={css(styles.processing_cat_fact)}>
                  {props.fact.text}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }

  buildLoadingMessage(props) {
    return (
      <div>
        <div className={css(styles.alert_message)}>
          <span>
            Loading File
          </span>
        </div>
      </div>
    )
  }

  buildIdleMessage(props) {
    return (
      <div>
        <div className={css(styles.idle_message)}>
          To import a lottie animation choose one of the two options above.
        </div>
        <div className={css(styles.idle_note)}>
          Hi! this is a first version of the Lottie importer.<br/>
          Some things are not fully supported but most of them are working.<br/>
          If you see anything missing, please email me the json to hernantorrisi@gmail.com<br/>
          Or create an issue in <a className={css(styles.link)} href='#' onClick={this.openInBrowser}>Lottie on github</a>
        </div>
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
