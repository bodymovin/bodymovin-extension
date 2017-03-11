import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import {hideAlert} from '../../redux/actions/generalActions'
import alertAnim from '../../assets/animations/alert.json'
import Bodymovin from '../bodymovin/bodymovin'
import BaseButton from '../buttons/Base_button'
import Variables from '../../helpers/styles/variables'

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

	createPars(pars){
		return pars.map(function(par, index){
			return <p key={index} className={css(styles.par)}>{par}</p>
		})
	}

	render() {
		if(!this.props.alerts.show){
			return null
		}else{
			return (<div className={css(styles.wrapper)}>
				<Bodymovin autoplay={true} loop={true} animationData={alertAnim}>
					<div className={css(styles.bm_container)}></div>
				</Bodymovin>
				<div className={css(styles.pars_container)}>
					{this.createPars(this.props.alerts.pars)}
				</div>
				<div className={css(styles.aligner)}>
					<BaseButton text='OK' type='green' onClick={this.props.hideAlert} />
				</div>
			</div>)
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