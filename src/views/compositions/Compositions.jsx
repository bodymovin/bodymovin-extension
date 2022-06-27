import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import CompositionsList from './list/CompositionsList'
import CompositionsListHeader from './listHeader/CompositionsListHeader'
import MainHeader from '../../components/header/Main_header'
import {
	getDestination, 
	filterChange, 
	toggleItem, 
	displaySettings, 
	getCompositions, 
	toggleShowSelected, 
	applySettingsToSelectedComps,
	toggleCompNameAsDefault,
	toggleCompNameAsFolder,
	toggleAEAsPath,
	toggleSaveInProjectFile,
	toggleDefaultPathAsFolder,
	defaultFolderFileChange,
	goToReports,
	selectAllComps,
	unselectAllComps,
	toggleCopySettings,
	settingsCopyPathChange,
	loadSettings,
} from '../../redux/actions/compositionActions'
import {startRender, showRenderBlock} from '../../redux/actions/renderActions'
import compositions_selector from '../../redux/selectors/compositions_selector'
import Variables from '../../helpers/styles/variables'
import GlobalSettings from './globalSettings/GlobalSettings'

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
		height: '100%',
		padding: '10px',
		backgroundColor: '#474747',
		display: 'flex',
      	flexDirection:'column',
	},
	toggleButton: {
			fontSize: '12px',
			color: '#eee',
			textDecoration:'underline',
			cursor: 'pointer',
			paddingTop: '6px',
			':hover': {
				color: Variables.colors.green,
			}
	},
	header: {
		flex: '0 0 auto',
	},
	content: {
		flex: '1 1 auto',
		height: '100%',
		display: 'flex',
      	flexDirection:'column',
      	minHeight: 0,
	},
})

class Compositions extends React.Component {

	constructor() {
		super()
		this.selectDestination = this.selectDestination.bind(this)
		this.showSettings = this.showSettings.bind(this)
		this.renderComps = this.renderComps.bind(this)
		this.state = {
			globalSettings: false,
		}
	}

	selectDestination(comp) {
		this.props.getDestination(comp);
	}

	showSettings(item) {
		this.props.displaySettings(item.id);
	}

	openGlobalSettings = () => {
		this.setState({
			globalSettings: true,
		})
	}

	closeGlobalSettings = () => {
		this.setState({
			globalSettings: false,
		})
	}

	renderComps() {
		if(!this.props.canRender){
			this.props.showRenderBlock(['There are no Compositions to render.','Make sure you have at least one selected and a Destination Path set.'])
		} else {
			this.props.startRender()
		}
	}

	renderSelectAllButton() {
		const hasUnselectedItems = this.props.visibleItems.some(item => item.selected === false)
		if (hasUnselectedItems) {
			return (
				<div 
					className={css(styles.toggleButton)} 
					onClick={this.props.selectAllComps}>
						{'Select All Comps'}
				</div>
			)
		} else {
			return (
				<div 
					className={css(styles.toggleButton)} 
					onClick={this.props.unselectAllComps}>
						{'Unselect All Comps'}
				</div>
			)
		}
	}

	render() {
		return (
			<div className={css(styles.wrapper)}>
				<div className={css(styles.header)} >
					<MainHeader 
						canRender={this.props.canRender}
						startRender={this.renderComps} 
						refresh={this.props.getCompositions} 
						applySettings={this.props.applySettingsToSelectedComps} 
						openGlobalSettings={this.openGlobalSettings}
					/>
				</div>
				<div className={css(styles.content)} >
					<CompositionsListHeader 
						filterValue={this.props.filter} 
						filterChange={this.props.filterChange} 
					/>
					<CompositionsList 
						items={this.props.visibleItems} 
						selectDestination={this.selectDestination}
						showSettings={this.showSettings}
						toggleItem={this.props.toggleItem}
						goToReports={this.props.goToReports}
					/>
					<div 
						className={css(styles.toggleButton)} 
						onClick={this.props.toggleShowSelected}>
							{this.props.showOnlySelected ? 'Show All' : 'Show Selected Compositions'}
					</div>
					{this.renderSelectAllButton()}
				</div>
				{this.state.globalSettings && 
					<GlobalSettings
						onClose={this.closeGlobalSettings}
						onCompNameAsDefaultToggle={this.props.onCompNameAsDefaultToggle}
						onIncludeCompNameAsFolderToggle={this.props.onIncludeCompNameAsFolderToggle}
						shouldUseCompNameAsDefault={this.props.shouldUseCompNameAsDefault}
						onAEAsPathToggle={this.props.onAEAsPathToggle}
						shouldUseAEPathAsDestinationFolder={this.props.shouldUseAEPathAsDestinationFolder}
						onDefaultPathAsFolder={this.props.onDefaultPathAsFolder}
						shouldUsePathAsDefaultFolder={this.props.shouldUsePathAsDefaultFolder}
						onDefaultPathChange={this.props.onDefaultPathChange}
						defaultFolderPath={this.props.defaultFolderPath}
						shouldIncludeCompNameAsFolder={this.props.shouldIncludeCompNameAsFolder}
						shouldKeepCopyOfSettings={this.props.shouldKeepCopyOfSettings}
						onCopySettingsToggle={this.props.onCopySettingsToggle}
						settingsDestinationCopy={this.props.settingsDestinationCopy}
						onSettingsCopyChange={this.props.onSettingsCopyChange}
						onSettingsLoad={this.props.onSettingsLoad}
						onSaveInProjectFile={this.props.onSaveInProjectFile}
						shouldSaveInProjectFile={this.props.shouldSaveInProjectFile}
					/>
				}
			</div>
			)
	}
}

function mapStateToProps(state) {
	return compositions_selector(state)
}

const mapDispatchToProps = {
	getDestination: getDestination,
	toggleItem: toggleItem,
	displaySettings: displaySettings,
	getCompositions: getCompositions,
	filterChange: filterChange,
	startRender: startRender,
	showRenderBlock: showRenderBlock,
	toggleShowSelected: toggleShowSelected,
	selectAllComps: selectAllComps,
	unselectAllComps: unselectAllComps,
	applySettingsToSelectedComps: applySettingsToSelectedComps,
	onCompNameAsDefaultToggle: toggleCompNameAsDefault,
	onIncludeCompNameAsFolderToggle: toggleCompNameAsFolder,
	onAEAsPathToggle: toggleAEAsPath,
	onSaveInProjectFile: toggleSaveInProjectFile,
	onCopySettingsToggle: toggleCopySettings,
	onDefaultPathAsFolder: toggleDefaultPathAsFolder,
	onDefaultPathChange: defaultFolderFileChange,
	goToReports: goToReports,
	onSettingsCopyChange: settingsCopyPathChange,
	onSettingsLoad: loadSettings,
}

export default connect(mapStateToProps, mapDispatchToProps)(Compositions)
