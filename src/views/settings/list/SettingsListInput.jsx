import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../../helpers/styles/variables'

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
      display:'flex',
      padding: '4px 0',
      height: '100%',
      alignItems: 'end'
    },
    item: {
      backgroundColor:'transparent',
      display:'flex',
      padding: '0 0 8px 0',
    },
    name: {
      flexGrow: 1,
      flexShrink: 1
    },
    'name--title': {
      color: '#fff',
      flexGrow: 0,
      flexShrink: 0,
      fontSize: '14px',
      marginRight: '10px',
      paddingBottom: '4px',
    },
    'name--desc': {
      color: '#ccc',
      fontSize: '12px',
      lineHeight: '14px'
    },
    input: {
      width: '100%',
    },
    disabled: {
      opacity: .3
    },
    emptyColumn: {
      width: '60px',
      flexGrow: 0,
      flexShrink: 0,
    },
    content: {
      flexGrow: 1,
      flexShrink: 1,
      padding: '0 4px',
    }
})

class SettingsListItem extends React.PureComponent {

  handleChange = (ev) => {
    this.props.onChange(ev.target.value)
  }

  render(){ 
    return (<li 
      className={css(styles.wrapper)}>
        <div className={css(styles.composition)}>
          <div className={css(styles.emptyColumn)}></div>
          <div className={css(styles.content)}>
            <div className={css(styles.item, styles.name)}>
              <div className={css(styles['name--title'])}>{this.props.title}</div>
              <input 
                className={css(styles['input'])}
                value={this.props.value}
                onChange={this.handleChange}
              />
            </div>
            <div title={this.props.description} className={css(styles['name--desc'])}>{this.props.description}</div>
          </div>
        </div>
      </li>)
  }
}

export default SettingsListItem