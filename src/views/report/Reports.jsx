import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import reports_view_selector from '../../redux/selectors/reports_view_selector'
import ReportsHeader from './ReportsHeader'
import Report from './Report'
import Settings from './settings/ReportSettings'
import {
  navigateToLayer,
  renderersUpdated,
  messagesUpdated,
} from '../../redux/actions/reportsActions'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: 'calc(100% - 10px)',
      padding: '10px',
      display: 'flex',
      flexDirection:'column',
    },
    content: {
      width: '100%',
      flex: '1 1 auto',
      padding: '10px',
      backgroundColor : Variables.colors.gray,
      overflow: 'auto',
    },
    header: {
      flex: '0 0 auto',
    },
    renderers: {
      padding: '0 0 10px 0',
    },
    report: {
      padding: '0 4px 0 0',
      backgroundColor: Variables.colors.gray,
    },
    settings: {
      width: '100%',
      height: '100%',
      backgroundColor : Variables.colors.gray_lighter,
      position: 'absolute',
      top: '0',
      left: '0',
    }
})

class Reports extends React.Component {

  state = {
    areSettingsOpen: false,
  }

  showSettings = () => this.setState({areSettingsOpen: true})
  hideSettings = () => this.setState({areSettingsOpen: false})

  render() {
    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.header)}>
          <ReportsHeader 
            onSettingsSelected={this.showSettings}
          />
        </div>
        <div className={css(styles.content)} >
          <div className={css(styles.report)}>
            <Report
              renderers={this.props.options.renderers}
              messageTypes={this.props.options.messageTypes}
              report={this.props.data}
              onLayerNavigation={this.props.onLayerNavigation}
            />
          </div>
        </div>
        {this.state.areSettingsOpen &&
          <div className={css(styles.settings)}>
            <Settings
              renderers={this.props.settings.renderers}
              messageTypes={this.props.settings.messageTypes}
              onRenderersUpdate={this.props.onRenderersUpdate}
              onMessagesUpdate={this.props.onMessagesUpdate}
              onClose={this.hideSettings}
            />
          </div>
        }
      </div>
      );
  }
}

function mapStateToProps(state) {
  return reports_view_selector(state)
}

const mapDispatchToProps = {
  onLayerNavigation: navigateToLayer,
  onRenderersUpdate: renderersUpdated,
  onMessagesUpdate: messagesUpdated,
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports)
