import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import PreviewViewer, {previewTypes} from './viewer/PreviewViewer'
import PreviewScrubber from './scrubber/PreviewScrubber'
import PreviewHeader from './header/PreviewHeader'
import CurrentRenders from './current_renders/CurrentRenders'
import {
	browsePreviewFile,
	updateProgress,
	setTotalFrames,
	showNoCurrentRenders,
	previewFromPath,
	updateColor,
	toggleLockTimeline,
	toggleLoop,
	initialize,
	finalize,
} from '../../redux/actions/previewActions'
import {goToComps} from '../../redux/actions/compositionActions'
import preview_view_selector from '../../redux/selectors/preview_view_selector'
import FileSaver from '../../helpers/FileSaver'

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
		height: '100%',
		padding: '10px',
		backgroundColor:'#474747'
	},
	container: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection:'column'
	},
	header: {
		width: '100%',
		flexGrow: 0,
		flexShrink: 0
	},
	animation: {
		width: '100%',
		flexGrow: 1,
		flexShrink: 1,
		position: 'relative'
	},
	scrubber: {
		width: '100%',
		flexGrow: 0,
		flexShrink: 0
	}
})

class Preview extends React.Component {

	constructor() {
		super()
		this.updateProgress = this.updateProgress.bind(this)
		this.saveFile = this.saveFile.bind(this)
		this.itemSelected = this.itemSelected.bind(this)
		this.selectCurrentRenders = this.selectCurrentRenders.bind(this)
		this.closeSelection = this.closeSelection.bind(this)
		this.state = {
			showingCurrentRenders: false,
			previewerTypes: [previewTypes.BROWSER],
		}
	}

	componentDidMount() {
		this.props.initialize()
	}

	componentWillUnmount() {
		this.props.finalize()
	}

	changeStart() {
		//console.log('changeStart')
	}

	updateProgress(value) {
		this.props.updateProgress(value)
	}

	saveFile(fileData) {

		var svgData = this.previewViewer.snapshot()
		FileSaver(svgData, ['svg'], 'snapshot.svg')
	}

	itemSelected(item) {
		this.props.previewFromPath(item.destination)
		this.closeSelection()
	}

	closeSelection() {
		this.setState({
			showingCurrentRenders: false
		})
	}

	selectCurrentRenders() {
		if(!this.props.previewableItems.length){
			this.props.showNoCurrentRenders()
		} else {
			this.setState({
				showingCurrentRenders: true
			})
		}
	}

  onRendedereSelected = toggledType => {
  	const availableTypes = [
  		previewTypes.BROWSER,
  		previewTypes.SKOTTIE,
  	]
  	let selectedTypes = availableTypes.filter(currentType => {
  		if (this.state.previewerTypes.includes(currentType)) {
  			return currentType !== toggledType
  		} else if (currentType === toggledType) {
  			return true
  		}
  		return false
  	})
  	this.setState({
  		previewerTypes: selectedTypes,
  	})
  }

  render() {

  	return (
  		<div className={css(styles.wrapper)}>
  			<div className={css(styles.container)}>
  				<div className={css(styles.header)}>
  					<PreviewHeader 
  						browseFiles={this.props.browsePreviewFile} 
  						goToComps={this.props.goToComps}
  						onRendererSelected={this.onRendedereSelected}
  						selectCurrentRenders={this.selectCurrentRenders} 
  						selectedTypes={this.state.previewerTypes}
  						updateColor={this.props.updateColor}
  						backgroundColor={this.props.backgroundColor}
  					/>
  				</div>
  				<div className={css(styles.animation)}> 
  					<PreviewViewer 
  						animationData={this.props.preview.animationData} 
  						assetsData={this.props.preview.assetsData} 
  						path={this.props.preview.path} 
  						renderer={this.props.renderer} 
  						progress={this.props.preview.progress} 
  						setTotalFrames={this.props.setTotalFrames} 
  						previewerTypes={this.state.previewerTypes}
  						ref={(elem => this.previewViewer = elem)}
  						backgroundColor={this.props.backgroundColor}
  					/>
  				</div>
  				<div className={css(styles.scrubber)}> 
  					<PreviewScrubber 
  						updateProgress={this.updateProgress} 
  						changeStart={this.changeStart} 
  						totalFrames={this.props.totalFrames} 
  						frameRate={this.props.frameRate} 
  						saveFile={this.saveFile} 
  						canSaveFile={this.state.previewerTypes.includes(previewTypes.BROWSER)} 
  						progress={this.props.preview.progress}
  						shouldLockTimelineToComposition={this.props.shouldLockTimelineToComposition}
  						shouldLoop={this.props.shouldLoop}
  						toggleLockTimeline={this.props.toggleLockTimeline}
  						toggleLoop={this.props.toggleLoop}
  					/>
  				</div>
  			</div>
  			{this.state.showingCurrentRenders && <CurrentRenders 
  				items={this.props.previewableItems}
  				cancelSelection={this.closeSelection}
  				itemSelected={this.itemSelected} />}
  		</div>
  	);
  }
}

function mapStateToProps(state) {
	return preview_view_selector(state)
}

const mapDispatchToProps = {
	browsePreviewFile: browsePreviewFile,
	previewFromPath: previewFromPath,
	updateProgress: updateProgress,
	setTotalFrames: setTotalFrames,
	goToComps: goToComps,
	showNoCurrentRenders: showNoCurrentRenders,
	updateColor: updateColor,
	toggleLockTimeline: toggleLockTimeline,
	toggleLoop: toggleLoop,
	initialize: initialize,
	finalize: finalize,
}

export default connect(mapStateToProps, mapDispatchToProps)(Preview)
