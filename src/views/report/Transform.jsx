import React from 'react'
import {
	getTransformMessageCount,
} from '../../helpers/reports/counter'
import Property from './Property'
import PositionProperty from './components/PositionProperty'
import RotationProperty from './components/RotationProperty'
import RowContainer from './components/RowContainer'

class Transform extends React.Component {

  buildContent = shouldAutoExpand => {
  	return ([
  		<Property
  			key={'anchorPoint'}
  			name={'Anchor Point'}
  			messages={this.props.transform.anchorPoint}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={shouldAutoExpand}
  		/>,
  		<PositionProperty
  			key={'position'}
  			property={this.props.transform.position}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={shouldAutoExpand}
  		/>,
  		<Property
  			key={'scale'}
  			name={'Scale'}
  			messages={this.props.transform.scale}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={shouldAutoExpand}
  		/>,
  		<RotationProperty
  			key={'rotation'}
  			property={this.props.transform.rotation}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={shouldAutoExpand}
  		/>,
  		<Property
  			key={'opacity'}
  			name={'Opacity'}
  			messages={this.props.transform.opacity}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={shouldAutoExpand}
  		/>,
  		<Property
  			key={'skew'}
  			name={'Skew'}
  			messages={this.props.transform.skew}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={shouldAutoExpand}
  		/>,
  		<Property
  			key={'skewAxis'}
  			name={'Skew Axis'}
  			messages={this.props.transform.skewAxis}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={shouldAutoExpand}
  		/>,
  		<Property
  			key={'startOpacity'}
  			name={'Start Opacity'}
  			messages={this.props.transform.startOpacity}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={shouldAutoExpand}
  		/>,
  		<Property
  			key={'endOpacity'}
  			name={'End Opacity'}
  			messages={this.props.transform.endOpacity}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={shouldAutoExpand}
  		/>
  	]
  	)
  }

  render() {
  	const messageCount = getTransformMessageCount(this.props.transform, this.props.renderers, this.props.messageTypes, this.props.builders)
  	return (
  		<RowContainer
  			name={'Transform'}
  			content={this.buildContent}
  			messageCount={messageCount}
  			shouldAutoExpand={this.props.shouldAutoExpand}
  		/>
  	);
  }
}

export default Transform
