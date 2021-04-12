import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../../helpers/styles/variables'
import BodymovinDots from '../../../components/bodymovin/bodymovin_dots'

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
		flexShrink: 1,
		alignItems: 'center',
	},
	'name--title': {
		color: '#fff',
		flexGrow: 0,
		flexShrink: 0,
		fontSize: '14px',
		marginRight: '10px',
	},
	'path': {
		flex: '1 1 auto',
		color: Variables.colors.green,
		padding: '0 4px',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		whiteSpace: 'nowrap',

	},
	'name--desc': {
		color: '#ccc',
		fontSize: '12px',
		lineHeight: '14px'
	},
	'name--icon': {
		width: '40px',
		height: '20px',
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
		overflow: 'hidden',
	}
})

class SettingsListFile extends React.PureComponent {

  onChange = () => {
  	this.props.onChange(this.props.value)
  }

  render(){ 
  	return (<li 
  		className={css(styles.wrapper)}>
  		<div className={css(styles.composition)}>
  			<div className={css(styles.emptyColumn)}></div>
  			<div className={css(styles.content)}>
  				<div className={css(styles.item, styles.name)}>
  					<div className={css(styles['name--title'])}>{this.props.title}</div>
  					{!!this.props.value &&
                <div
                	onClick={this.onChange}
                	className={css(styles['path'])}
                >
                	{this.props.value.fsName}
                </div>
  					}
  					{!this.props.value && 
                <div className={css(styles['name--icon'])}>
                	<BodymovinDots onClick={this.onChange} />
                </div>
  					}
  				</div>
  				<div title={this.props.description} className={css(styles['name--desc'])}>{this.props.description}</div>
  			</div>
  		</div>
  	</li>)
  }
}

export default SettingsListFile