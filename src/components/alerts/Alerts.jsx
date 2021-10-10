import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import {hideAlert} from '../../redux/actions/generalActions'
import alertAnim from '../../assets/animations/alert.json'
import Bodymovin from '../bodymovin/bodymovin'
import BaseButton from '../buttons/Base_button'
import Variables from '../../helpers/styles/variables'
import CacheAlert from './CacheAlert'
import BaseAlert from './BaseAlert'

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    padding: '10px',
    position: 'absolute',
    top:'0',
    left:'0',
    backgroundColor:'rgba(71,71,71,.9)',
    overflow: 'auto'
  },
  aligner: {
  	textAlign: 'center'
  },
  pars_container:{
  	paddingBottom: '10px'
  },
  par:{
  	fontFamily: 'Roboto-Bold',
  	fontSize: '12px',
  	lineHeight: '15px',
  	textAlign: 'center',
  	color: Variables.colors.white
  },
  bm_container: {
  	height: '250px'
  }
})

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