import React from 'react'
import {connect} from 'react-redux'
import {hideAlert} from '../../redux/actions/generalActions'
import CacheAlert from './CacheAlert'
import BaseAlert from './BaseAlert'

class Alerts extends React.Component {

	render() {
		if(!this.props.alerts.show){
			return null
		} else if (this.props.alerts.type === 'cache') {
			return <CacheAlert />
		}else{
			return (
				<BaseAlert 
					pars={this.props.alerts.pars}
					buttons={
						[
							{
								text: 'OK',
								type: 'green',
								action: this.props.hideAlert,
							}
						]
					}
				/>
			)
		}
		
	}
}

function mapStateToProps(state) {
  return {alerts: state.alerts}
}

const mapDispatchToProps = {
  hideAlert: hideAlert
}

export default connect(mapStateToProps, mapDispatchToProps)(Alerts)