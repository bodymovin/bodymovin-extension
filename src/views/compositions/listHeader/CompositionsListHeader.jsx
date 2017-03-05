import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import glass from '../../../assets/svg/glass.svg'
import Variables from '../../../helpers/styles/variables'
import textEllipsis from '../../../helpers/styles/textEllipsis'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      fontSize: '12px',
      color: '#eee',
      marginBottom: '10px'
    },
    item: {
      display: 'inline-block',
      verticalAlign: 'middle',
      textAlign: 'center',
      padding: '0px 10px',
    },
    radio: {
      width: '70px'
    },
    settings: {
      width: '80px'
    },
    name: {
      width: 'calc( 60% - 75px)',
      height: '24px'

    },
    nameBox: {
      border: '2px solid ' + Variables.colors.gray2,
      backgroundColor: '#333',
      borderRadius: '6px',
      width: '100%',
      height: '100%'
    },
    name_input: {
      display: 'inline-block',
      verticalAlign: 'top',
      height: '100%',
      width: 'calc( 100% - 30px)',
      background: 'none',
      color: '#eee',
      padding: '0px 3px',
      border: 'none',
      ':focus': {
        border: 'none',
        outline: 'none'
      }
    },
    name_glass: {
      display: 'inline-block',
      verticalAlign: 'top',
      width: '30px',
      height: '100%',
      backgroundImage: 'url("'+glass+'")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '17px 17px'
    },
    name_glass_image: {
      maxHeight: '50%',
      maxWidth: '50%'
    },
    destination: {
      width: 'calc( 40% - 75px)',
      textAlign: 'left'
    }
});

class CompositionsListHeader extends React.Component {
  render() {
    return (
    	<ul className={css(styles.container)}>
        <li className={css(styles.item, styles.radio, textEllipsis)}>Selected</li>
        <li className={css(styles.item, styles.settings, textEllipsis)}>Settings</li>
        <li className={css(styles.item, styles.name, textEllipsis)}>
          <div className={css(styles.nameBox)}>
            <input className={css(styles.name_input)} type="text" placeholder="Name" onChange={this.props.filterChange} value={this.props.filterValue} />
            <div className={css(styles.name_glass)}>
            </div>
          </div>
        </li>
    		<li className={css(styles.item, styles.destination, textEllipsis)}>../Destination Folder</li>
    	</ul>
    	);
  }
}

export default CompositionsListHeader