import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BodymovinCheckbox from '../../../components/bodymovin/bodymovin_checkbox'
import checkbox from '../../../assets/animations/checkbox.json'
import Variables from '../../../helpers/styles/variables'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      paddingBottom: '10px',
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
      alignItems: 'end'
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
    'name--title': {
      color: '#fff',
      fontSize: '14px',
      marginRight: '10px',
      paddingBottom: '4px',
    },
    'name--desc': {
      color: '#ccc',
      fontSize: '12px',
      lineHeight: '14px'
    },
    inputBox: {
      border: '1px solid ' + Variables.colors.white,
      backgroundColor: '#333',
      borderRadius: '6px',
      maxWidth:'50px',
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

class SettingsListItem extends React.PureComponent {

	render(){ 
		return (<li 
			className={css(styles.wrapper, this.props.active && styles.wrapper__active)}>
        <div className={css(styles.composition)}>
  	      <BodymovinCheckbox animationData={checkbox} animate={this.props.active}>
  	          <button className={css(styles.item, styles.radio)} onClick={this.props.toggleItem}></button>
  	      </BodymovinCheckbox>
  				<div className={css(styles.item, styles.name)}>
            <div className={css(styles['name--title'])}>{this.props.title}</div>
            <div title={this.props.description} className={css(styles['name--desc'])}>{this.props.description}</div>
          </div>
  				{this.props.needsInput && <div className={css(styles.item, styles.inputBox, this.props.active ? '' : styles.disabled)}>
            <input disabled={!this.props.active} className={css(styles.item, styles.inputInput)} value={this.props.inputValue} onChange={this.props.inputValueChange} type="text" />
          </div>}
				</div>
			</li>)
	}
}

export default SettingsListItem