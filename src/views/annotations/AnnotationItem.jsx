import React, {PureComponent} from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
		cursor: 'pointer',
		display: 'flex',
		'align-items': 'center',
		'padding': '10px',
		'background-color': Variables.colors.gray,
	},
	'wrapper--active': {
		cursor: 'default',
	},
	'annotation-checkbox': {
		width: '15px',
		flex: '0 0 auto',
		height: '15px',
		border: `1px solid ${Variables.colors.white}`,
		marginRight: '6px',
	},
	'annotation-checkbox--active': {
		'background-color' : Variables.colors.white,
	},
	'annotation-name': {
		color: Variables.colors.white,
		font: 'Arial',
		flex: '1 1 auto',
	},
})

class AnnotationItem extends PureComponent {

	render() {

		console.log('rerendering')

		return (
			<div
				className={css(
					styles['wrapper'],
					this.props.isActive && styles['wrapper--active'],
				)
				}
				onClick={this.props.isActive ? null : this.props.onSelect}
			>
				<div

					className={css(
						styles['annotation-checkbox'],
						this.props.isActive && styles['annotation-checkbox--active'],
					)
					}
				/>
				<div
					className={css(styles['annotation-name'])}
				>
					{this.props.data.name}
				</div>
			</div>
		);
	}
}

export default AnnotationItem
