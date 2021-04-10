import React from 'react'
import {
	getShapeGroupMessagesCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import Transform from '../Transform'
import ShapeCollection from './ShapeCollection'

class GroupShape extends React.Component {

  buildTransform = shouldAutoExpand => (
  	<Transform
  		key={'transform'}
  		transform={this.props.shape.transform}
  		renderers={this.props.renderers}
  		messageTypes={this.props.messageTypes}
  		builders={this.props.builders}
  		shouldAutoExpand={shouldAutoExpand}
  	/>
  )

  buildShapes = shouldAutoExpand => (
  	<ShapeCollection
  		key={'shapes'}
  		shapes={this.props.shape.shapes}
  		renderers={this.props.renderers}
  		messageTypes={this.props.messageTypes}
  		builders={this.props.builders}
  		shouldAutoExpand={shouldAutoExpand}
  	/>
  )

  buildContent = shouldAutoExpand => {
  	return (
  		[
  			this.buildTransform(shouldAutoExpand),
  			this.buildShapes(shouldAutoExpand),
  		]
  	)
  }

  render() {
  	const messageCount = getShapeGroupMessagesCount(
  		this.props.shape,
  		this.props.renderers,
  		this.props.messageTypes,
  		this.props.builders,
  	)
  	return (
  		<RowContainer
  			name={this.props.name}
  			content={this.buildContent}
  			messageCount={messageCount}
  			shouldAutoExpand={this.props.shouldAutoExpand}
  		/>
  	);
  }
}

export default GroupShape
