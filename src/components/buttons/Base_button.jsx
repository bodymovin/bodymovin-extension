import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../helpers/styles/variables'
import Bodymovin from '../bodymovin/bodymovin'

const styles = StyleSheet.create({
    container: {
      borderRadius: '3px',
      padding: '8px 20px',
      color: 'white',
      fontSize: '12px',
      fontFamily: 'Roboto-Bold',
      verticalAlign:'middle',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      minWidth: '80px'
    },
    green: {
    	backgroundColor: Variables.colors.green,
      color: Variables.colors.white,
    	':disabled': {
          color: Variables.colors.gray2,
          backgroundColor: Variables.colors.gray,
      		cursor: 'default'
      },
      ':hover': {
        backgroundColor: Variables.colors.green2,
        color: Variables.colors.white
      }
    },
    gray: {
    	backgroundColor: Variables.colors.gray_lighter,
    	border: '1px solid ' + Variables.colors.button_gray_text,
      color: Variables.colors.button_gray_text,
      ':disabled': {
          color: Variables.colors.gray2,
          cursor: 'default'
      },
      ':hover': {
          backgroundColor: Variables.colors.gray_lighter,
          color: Variables.colors.white,
          border: '1px solid ' + Variables.colors.white
      }
    },
    disabled:{
      opacity: '0.8'
    },
    icon: {
      display: 'inline-block',
      width: '23px',
      height: '16px',
      verticalAlign: 'top',
      marginRight: '10px'
    }

});

class BaseButton extends React.Component{

  constructor(){
    super()
    this.mouseEnterHandler = this.mouseEnterHandler.bind(this)
    this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this)
  }

  mouseEnterHandler(){
    if(this.bm_instance){
      this.bm_instance.goToAndPlay(0)
    }
  }

  mouseLeaveHandler(){
    if(this.bm_instance){
      this.bm_instance.goToAndStop(0)
    }
  }

  render(){
    let containerClasses = css(
      styles.container,
      this.props.type === 'green' && styles.green,
      this.props.type === 'gray' && styles.gray,
      this.props.disabled && styles.disabled,
      this.props.classes
    )

    return (
      <button 
        disabled={this.props.disabled}
        title={this.props.text} 
        className={containerClasses} 
        onClick={this.props.onClick} 
        onMouseEnter={this.mouseEnterHandler} 
        onMouseLeave={this.mouseLeaveHandler}
      >
        {this.props.icon && 
          <Bodymovin animationData={this.props.icon} ref={(elem)=>this.bm_instance = elem} autoplay={false} loop={false}>
            <div className={css(styles.icon)}></div>
          </Bodymovin>
        }
        {this.props.text}
      </button>)
  }
	
}

BaseButton.defaultProps = {
	disabled: false
}

export default BaseButton