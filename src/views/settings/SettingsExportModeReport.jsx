import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import SettingsListItem from './list/SettingsListItem'
import {
  handleModeToggle, 
} from '../../redux/actions/compositionActions'
import settings_selector from '../../redux/selectors/settings_reports_selector'
import SettingsReportRenderers from './reports/SettingsReportRenderers'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%'
    },
    wrapperActive: {
      border: '1px solid #666',
    },
    compsList: {
      width: '100%',
      flexGrow: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '0 0 0 10px',
    },
})

class SettingsExportModeReport extends React.PureComponent {

  handleModeToggle = () => {
    this.props.handleModeToggle('reports');
  }

	render(){ 
		return (
      <div className={css(styles.wrapper, this.props._isActive && styles.wrapperActive)}>
        <ul>
          <SettingsListItem 
            title='Report'
            description='Export a report of the animation'
            toggleItem={this.handleModeToggle}
            active={this.props._isActive} />
        </ul>
        {this.props._isActive && 
          <ul className={css(styles.compsList)}>
            <SettingsReportRenderers
              options={this.props.rendererOptions}
              onChange={this.props.handleReportChange}
            />
          </ul>
        }
      </div>
    )
	}
}

function mapStateToProps(state) {
  return settings_selector(state)
}

const mapDispatchToProps = {
  handleModeToggle: handleModeToggle,
  handleReportChange: handleModeToggle,
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsExportModeReport)