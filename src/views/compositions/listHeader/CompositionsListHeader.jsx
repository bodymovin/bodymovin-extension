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
		marginBottom: '10px',
		flex: '0 0 auto',
		display: 'flex',
		alignItems: 'center',
	},
	item: {
		display: 'inline-block',
		verticalAlign: 'middle',
		textAlign: 'center',
		padding: '0px 10px',
	},
	itemCompName: {
		marginBottom: '4px'
	},
	itemCompNameInput: {
		verticalAlign: 'middle'
	},
	radio: {
		width: '80px'
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
		height: '100%',
		display: 'flex',
	},
	name_input: {
		display: 'inline-block',
		verticalAlign: 'top',
		height: '100%',
		flex: '1 1 auto',
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
		flex: '1 1 auto',
		textAlign: 'left'
	}
});

class CompositionsListHeader extends React.Component {
	render() {
		return (
    	<ul className={css(styles.container)}>
				<li className={css(styles.item, styles.radio, textEllipsis)}>Selected</li>
				<li className={css(styles.item, styles.settings, textEllipsis)}>Settings</li>
				<li className={css(styles.item, styles.settings, textEllipsis)}>Report</li>
				<li className={css(styles.item, styles.name, textEllipsis)}>
					<div className={css(styles.nameBox)}>
						<input className={css(styles.name_input)} type="text" placeholder="Name" onChange={this.props.filterChange} value={this.props.filterValue} />
						<div className={css(styles.name_glass)}>
						</div>
					</div>
				</li>
    		<li 
					className={css(styles.item, styles.destination, textEllipsis)}
				>
					<div className={css(styles.itemCompName)}>
						<input 
							type="checkbox" 
							onChange={this.props.onCompNameAsDefaultToggle}
							checked={this.props.shouldUseCompNameAsDefault}
							className={css(styles.itemCompNameInput)}
						/>
						<span>Use comp name</span>
					</div>
					<div>../Destination Folder</div>
				</li>
    	</ul>
    	);
	}
}

export default CompositionsListHeader