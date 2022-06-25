import React from 'react'
import {connect} from 'react-redux'
import {hideAlert} from '../../redux/actions/generalActions'
import CacheAlert from './CacheAlert'
import BaseAlert from './BaseAlert'
import StorageAlert from './StorageAlert'

class Alerts extends React.Component {

	render() {
		if(!this.props.alerts.show){
			return null
		} else if (this.props.alerts.type === 'cache') {
			return <CacheAlert />
		} else if (this.props.alerts.type === 'storage') {
			return <StorageAlert
				data={this.props.alerts}
			/>
		} else{
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