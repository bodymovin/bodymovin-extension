import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BaseHeader from '../../components/header/Base_Header'
import BaseButton from '../../components/buttons/Base_button'

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
	},
	buttons_container: {
		width: '100%',
		height: '50px',
		display: 'flex',
		alignItems:'center'
	},
	button: {
		marginRight:'7px',
		flex: '0 0 auto',
	},
})

class ReportsHeader extends React.Component {

	render() {
		return (
			<div className={css(styles.wrapper)}>
				<BaseHeader/>
				<div className={css(styles.buttons_container)}>
					<BaseButton
						text='Settings'
						type='green'
						classes={styles.button}
						onClick={this.props.onSettingsSelected} />
					<BaseButton
						text='Import Report'
						type='green'
						classes={styles.button}
						onClick={this.props.onImportSelected} />
				</div>
			</div>
		);
	}
}

export default ReportsHeader
