import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import {
	initialize,
	finalize,
	activateAnnotations,
} from '../../redux/actions/annotationActions'
import BaseHeader from '../../components/header/Base_Header'
import annotationsSelector from '../../redux/selectors/annotations_selector'
import Layer from './Layer'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
		height: 'calc(100% - 10px)',
		padding: '10px',
		display: 'flex',
		flexDirection:'column',
	},
	content: {
		width: '100%',
		flex: '1 1 auto',
		display: 'flex',
		flexDirection:'column',
		padding: '10px',
		backgroundColor :'#474747',
		overflow: 'auto',
	},
	header: {
		flex: '0 0 auto',
	},
	title: {
		color: Variables.colors.white,
		padding: '6px 4px 4px',
		fontSize: '14px',
		borderBottom: `1px solid ${Variables.colors.white}`,
	},
	layersContainer: {
		width: '100%',
	},
	emptyState: {
		color: Variables.colors.white,
		textAlign: 'center',
		padding: '30px 20px 0',
		lineHeight: '1.5',

	}
})

class Annotations extends PureComponent {

	componentDidMount() {
		this.props.initialize()
	}

	buildLayers(layers) {
		return layers
			.map(layer => <Layer
				key={layer.id}
				id={layer.id}
				onActivateAnnotations={this.props.activateAnnotations}
				activeAnnotations={layer.annotations}
				name={layer.name}
				availableAnnotations={this.props.annotations}
			/>
			)
	}

	buildEmptyState() {
		return (
			<div
				className={css(styles.emptyState)}
			>
				<span>Select one or more layers from your composition to add annotations to them</span>
			</div>
		)
	}

	buildContent(layers) {
		if (layers.length === 0) {
			return this.buildEmptyState()
		} else {
			return this.buildLayers(layers)
		}
	}

	render() {

		return (
			<div className={css(styles.wrapper)} >
				<div className={css(styles.header)} >
					<BaseHeader />
				</div>
				<div className={css(styles.content)} >
					<div className={css(styles.title)} >
            Annotations
					</div>
					<div className={css(styles.layersContainer)} >
						{this.buildContent(this.props.layers)}
					</div>
				</div>
			</div>
		);
	}

	componentWillUnmount() {
		this.props.finalize()
	}
}

const mapStateToProps = function(state) {
	return annotationsSelector(state)
}

const mapDispatchToProps = {
	initialize: initialize,
	finalize: finalize,
	activateAnnotations: activateAnnotations,
}

export default connect(mapStateToProps, mapDispatchToProps)(Annotations)
