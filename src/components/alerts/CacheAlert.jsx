import BaseAlert from './BaseAlert'
import React from 'react'
import {connect} from 'react-redux'
import {clearCacheConfirmed, clearCacheCancelled} from '../../redux/actions/compositionActions'

class CacheAlerts extends React.Component {

	render() {
		return (<BaseAlert
      buttons={[
        {
          text: 'Confirm',
          action: this.props.clearCacheConfirmed,
          type: 'green',
        },
        {
          text: 'Cancel',
          action: this.props.clearCacheCancelled,
          type: 'gray',
        },
      ]}
      pars={[
        'Are you sure you want to clear the caché?',
        'You will lose the settings for all projects.',
        'Use this only if something is not working correctly.',
      ]}
    />)
	}
}

function mapStateToProps(state) {
  return {alerts: state.alerts}
}

const mapDispatchToProps = {
  clearCacheConfirmed: clearCacheConfirmed,
  clearCacheCancelled: clearCacheCancelled,
}

export default connect(mapStateToProps, mapDispatchToProps)(CacheAlerts)