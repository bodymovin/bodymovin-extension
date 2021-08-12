import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BodymovinCheckbox from '../../../components/bodymovin/bodymovin_checkbox'
import checkbox from '../../../assets/animations/checkbox.json'
import Variables from '../../../helpers/styles/variables'
import BaseButton from '../../../components/buttons/Base_button'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      padding: '10px 10px 10px 0',
      minHeight: '40px',
      backgroundColor: Variables.colors.gray_darkest,
    },
    wrapper__active: {
      background: Variables.gradients.blueGreen
    },
    composition: {
      width: '100%',
      fontSize: '12px',
      color: Variables.colors.white,
      padding: '4px 0',
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    },
    item: {
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor:'transparent'
    },
    radio: {
      width: '60px',
      height: '20px',
      padding:'2px',
      cursor: 'pointer'
    },
    name: {
      flexGrow: 1,
      flexShrink: 1,
      padding: '0 4px'
    },
    value: {
      flexGrow: 1,
      flexShrink: 1,
    },
    'name--title': {
      color: '#000',
      fontSize: '14px',
      marginRight: '10px',
      paddingBottom: '4px',
    },
    label: {
      color: '#ccc',
      fontSize: '12px',
      lineHeight: '14px',
      paddingBottom: '2px',
    },
    inputBox: {
      border: '1px solid ' + Variables.colors.white,
      backgroundColor: '#333',
      borderRadius: '6px',
      marginRight:'20px' ,
      padding: '3px'
    },
    inputInput: {
      background: 'none',
      width:'100%',
      border: 'none',
      ':focus': {
        border: 'none',
        outline: 'none'
      },
      color: Variables.colors.white
    },
    disabled: {
      opacity: .3
    }
})

class SettingsListCustomProp extends React.PureComponent {

	render(){ 
		return (<li 
			className={css(styles.wrapper, this.props.active && styles.wrapper__active)}>
        <div className={css(styles.composition)}>
  	      <BodymovinCheckbox animationData={checkbox} animate={this.props.active}>
  	          <button className={css(styles.item, styles.radio)} onClick={this.props.toggleItem}></button>
  	      </BodymovinCheckbox>
  				<div className={css(styles.item, styles.name)}>
            <div className={css(styles.label)}>Property Name</div>
            <input
              className={css(styles['name--title'])}
              onChange={(ev) => this.props.titleValueChange(ev.target.value)}
              value={this.props.title}
              type="text"
            />
          </div>
  				<div className={css(styles.item, styles.value)}>
            <div className={css(styles.label)}>Property Value</div>
            <div className={css(styles.inputBox)}>
              <input
                disabled={!this.props.active}
                className={css(styles.item, styles.inputInput)}
                value={this.props.inputValue}
                onChange={(ev) => this.props.inputValueChange(ev.target.value)}
                type="text" />
              </div>
          </div>
          <BaseButton onClick={this.props.onDelete} text={'Delete'} type='green'/>
				</div>
			</li>)
	}
}

export default SettingsListCustomProp