import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../helpers/styles/variables'
import Bodymovin from '../bodymovin/bodymovin'

const styles = StyleSheet.create({
    container: {
      borderRadius: '3px',
      padding: '8px 4px 2px',
      color: 'white',
      fontSize: '12px',
      fontFamily: 'Roboto-Bold',
      verticalAlign:'middle',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      background: 'transparent',
    },
    green: {
      color: Variables.colors.green,
    	':disabled': {
          color: Variables.colors.gray2,
      		cursor: 'default'
      },
      ':hover': {
        color: Variables.colors.white
      }
    },
    gray: {
      color: Variables.colors.button_gray_text,
      ':disabled': {
          color: Variables.colors.gray2,
          cursor: 'default'
      },
      ':hover': {
          color: Variables.colors.white,
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
    },
    text: {
      'border-bottom': '1px solid ' + Variables.colors.white,
    },
    'text--green': {
      'borderBottomColor': Variables.colors.green,
    },
    'text--selected': {
      'border-bottom': 'none',
    },
    'green--selected': {
      cursor: 'default',
      color: Variables.colors.green,
      ':hover': {
        color: Variables.colors.green,
      }
    },
    'gray--selected': {
      cursor: 'default',
      color: Variables.colors.green,
      ':hover': {
        color: Variables.colors.green,
      }
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
      this.props.type === 'gray' && this.props.selected && styles['gray--selected'],
      this.props.type === 'green' && this.props.selected && styles['green--selected'],
      this.props.disabled && styles.disabled,
      this.props.classes
    )

    return (
      <button 
        disabled={this.props.disabled}
        title={this.props.alt || this.props.text} 
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
        <span className={css(
          styles.text,
          this.props.type === 'green' && styles['text--green'],
          this.props.selected && styles['text--selected'],
        )} >
          {this.props.text}
        </span>
      </button>)
  }
	
}

BaseButton.defaultProps = {
	disabled: false,
	alt: '',
}

export default BaseButton