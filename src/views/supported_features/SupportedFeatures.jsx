import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import {
	initialize,
  finalize, 
} from '../../redux/actions/supportedFeaturesActions'
import supported_features_selector from '../../redux/selectors/supported_features_view_selector'
import BaseHeader from '../../components/header/Base_Header'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
		height: '100%',
		padding: '10px',
		backgroundColor: '#474747',
		display: 'flex',
    flexDirection:'column',
    color: Variables.colors.white,
	},
	header: {
		flex: '0 0 auto',
	},
	infoContainer: {
		flex: '1 1 auto',
		height: '100%',
		display: 'flex',
    flexDirection:'column',
    minHeight: 0,
	},
	frameContainer: {
		height: '100%',
		width: '100%',
	},
  instructionsContainer: {
		height: '100%',
		width: '100%',
    padding: '8px',
  },
  dropdown: {
    margin: '8px 0',
  },
})

class SupportedFeatures extends React.Component {

  state = {
    selectedFeature: null,
  }

  componentDidMount() {
    this.props.initialize()
  }

  componentWillUnmount() {
    this.props.finalize()
  }

  componentDidUpdate() {
    if (!this.state.selectedFeature && this.props.features.length) {
      this.setState({
        selectedFeature: this.props.features[0]
      })
    } else if (this.state.selectedFeature && !this.props.features.length) {
      this.setState({
        selectedFeature: null
      })
    } else if(this.state.selectedFeature) {
      const feature = this.props.features.find(feature => feature.matchName === this.state.selectedFeature.matchName)
      if (!feature) {
        this.setState({
          selectedFeature: this.props.features[0]
        })
      }
    }
  }

  buildFeature(feature, documentedFeatures) {
    if (documentedFeatures.features[feature.matchName]) {
      const featureData = documentedFeatures.features[feature.matchName];
      return <li onClick={() => this.setState({selectedFeature: featureData})}>
        {feature.name || featureData.name}
      </li>
    } else {
      return <li>{feature.name}</li>
    }
  }

  handleChange = (ev) => {
    this.setState({
      selectedFeature: this.props.features.find(feature => feature.matchName === ev.target.value)
    })
  }

  buildFeaturesList(documentedFeatures, selectedFeatures) {
    return selectedFeatures.map(selectedFeature => {
      const featureData = {
        name: selectedFeature.name,
        matchName: selectedFeature.matchName,
      }
      if (documentedFeatures.features[selectedFeature.matchName]) {
        var documentData = documentedFeatures.features[selectedFeature.matchName]
        featureData.link = documentedFeatures.rootPath + documentData.file_name
        featureData.name = featureData.name || documentData.name;
      }
      return featureData;
    })
  }

  buildFeaturesInfo(features) {
    if(!features.length || !this.state.selectedFeature) {
      return null;
    }
    return (
      <select 
        className={css(styles.dropdown)} 
        onChange={this.handleChange}
        value={this.state.selectedFeature.matchName}
      >
        {features.map(option => (
          <option 
            key={option.matchName} 
            value={option.matchName}
          >
            {option.name}
          </option>))}
      </select>
    )
  }

  buildInfo() {
    if (!this.state.selectedFeature) {
      return (
        <div className={css(styles.instructionsContainer)}>
            <div>Select one or more properties from your project</div>
            <div>To get info about their support</div>
        </div>
      );
    }
    if (!this.state.selectedFeature.link) {
      return  (
        <div className={css(styles.missingDataContainer)}>
          <div>No data for this property</div>
        </div>
      )
    }
    return (
      <iframe
        src={this.state.selectedFeature.link}
        className={css(styles.frameContainer)}
      />
    )
  }

	render() {
    console.log(this.state.selectedFeature);
		return (
			<div className={css(styles.wrapper)}>
        <div className={css(styles.header)} >
          <BaseHeader />
				</div>
        {this.buildFeaturesInfo(this.props.features)}
        <div className={css(styles.infoContainer)}>
          {this.buildInfo()}
        </div>
			</div>
			)
	}
}

function mapStateToProps(state) {
	return supported_features_selector(state)
}

const mapDispatchToProps = {
	initialize: initialize,
	finalize: finalize,
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportedFeatures)
