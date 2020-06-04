import React from 'react'
import {
  getShapeGroupMessagesCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import Transform from '../Transform'
import ShapeCollection from './ShapeCollection'

class GroupShape extends React.Component {

  buildTransform = () => (
    <Transform
      key={'transform'}
      transform={this.props.shape.transform}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
    />
  )

  buildShapes = () => (
    <ShapeCollection
      key={'shapes'}
      shapes={this.props.shape.shapes}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
    />
  )

  buildContent = () => {
    return (
      [
        this.buildTransform(),
        this.buildShapes(),
      ]
    )
  }

  render() {
    const messageCount = getShapeGroupMessagesCount(
      this.props.shape,
      this.props.renderers,
      this.props.messageTypes
    )
    return (
      <RowContainer
        name={this.props.name}
        content={this.buildContent}
        messageCount={messageCount}
      />
    );
  }
}

export default GroupShape
