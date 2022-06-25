import React from 'react'
import { StyleSheet, css } from 'aphrodite'
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
    overflow: 'auto',
    display: 'flex',
    'flex-direction': 'column',
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
  	height: '1px',
  	'min-height': '50px',
    flex: '1 1 auto',
  },
  buttonContainer: {
    padding: '0 10px',
    display: 'inline-block',
  }
})

class BaseAlert extends React.Component {

	createPars(pars){
		return pars.map(function(par, index){
			return <p key={index} className={css(styles.par)}>{par}</p>
		})
	}

  buildButtons(buttons) {
    return buttons.map((button, index) => {
      return (
      <div className={css(styles.buttonContainer)} key={index}>
        <BaseButton
          text={button.text}
          type={button.type || 'green'}
          onClick={button.action}
        />
      </div>
    )
    })
  }

	render() {
    return (<div className={css(styles.wrapper)}>
      <Bodymovin autoplay={true} loop={true} animationData={alertAnim}>
        <div className={css(styles.bm_container)}></div>
      </Bodymovin>
      <div className={css(styles.pars_container)}>
        {this.createPars(this.props.pars)}
      </div>
      {this.props.children}
      <div className={css(styles.aligner)}>
        {this.buildButtons(this.props.buttons)}
      </div>
    </div>)
  }
}

BaseAlert.defaultProps = {
  pars: [],
  buttons: [],
}

export default BaseAlert