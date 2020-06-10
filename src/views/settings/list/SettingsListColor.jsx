import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../../helpers/styles/variables'
import { SketchPicker } from 'react-color'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      paddingBottom: '10px',
      minHeight: '40px',
      backgroundColor: Variables.colors.gray_darkest,
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
    'radio--color': {
      border: ` 1px solid ${Variables.colors.gray_lighter}`,
      outline: ` 1px solid ${Variables.colors.white}`,
      display: 'inline-block',
      width: '16px',
      height: '16px',
      borderRadius: '2px',
      position: 'relative',
    },
    'radio--picker': {
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

class SettingsListColor extends React.PureComponent {

  state = {
      isColorPickerEnabled: false,
  }

  toggleColorPicker = () => {
      this.setState({
          isColorPickerEnabled: !this.state.isColorPickerEnabled,
      })
  }

  updateColor = colorData => {
    this.props.inputValueChange(colorData.hex)
  }

  render(){ 
    return (<li 
      className={css(styles.wrapper)}>
        <div className={css(styles.composition)}>
          <button className={css(styles.item, styles.radio)} onClick={this.props.toggleItem}>
            <div
              onClick={this.toggleColorPicker}
              className={css(styles['radio--color'])}
              style={{backgroundColor: this.props.inputValue}}
            >
            </div>
          </button>
          <div className={css(styles.item, styles.name)}>
            <div className={css(styles['name--title'])}>{this.props.title}</div>
            <div title={this.props.description} className={css(styles['name--desc'])}>{this.props.description}</div>
            {this.state.isColorPickerEnabled && 
                <div
                  className={css(styles['radio--picker'])}
                >
                  <SketchPicker 
                    color={ this.props.inputValue }
                    onChangeComplete={ this.updateColor }
                  />
              </div>
            }
          </div>
        </div>
      </li>)
  }
}

export default SettingsListColor