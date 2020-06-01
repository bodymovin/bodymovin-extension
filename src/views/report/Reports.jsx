import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import reports_view_selector from '../../redux/selectors/reports_view_selector'
import BaseHeader from '../../components/header/Base_Header'
import ReportsRenderers from './ReportsRenderers'
import Report from './Report'
import mockReport from '../../helpers/mockReport'
import {
  navigateToLayer,
} from '../../redux/actions/reportsActions'

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
      backgroundColor :'#474747',
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
      backgroundColor: '#333333',
    }
})

class Reports extends React.Component {

  state = {
    renderers: [],
    messageTypes: ['warning', 'error'],
  }

  onSelectedRenderers = renderers => {
    this.setState({
      renderers: this.buildAvailableRenderers(renderers),
    })
  }

  buildAvailableRenderers = renderers => {
    return renderers
    .filter(renderer => renderer.isSelected)
    .map(renderer => renderer.id)
  }

  render() {
    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.header)}>
          <BaseHeader />
        </div>
        <div className={css(styles.content)} >
          <div className={css(styles.renderers)}>
            <ReportsRenderers
              onUpdate={this.onSelectedRenderers}
            />
          </div>
          <div className={css(styles.report)}>
            <Report
              renderers={this.state.renderers}
              messageTypes={this.state.messageTypes}
              report={mockReport}
              onLayerNavigation={this.props.onLayerNavigation}
            />
          </div>
        </div>
      </div>
      );
  }
}

function mapStateToProps(state) {
  return reports_view_selector(state)
}

const mapDispatchToProps = {
  onLayerNavigation: navigateToLayer,
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports)
