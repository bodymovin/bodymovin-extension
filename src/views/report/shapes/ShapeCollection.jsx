import React from 'react'
import {
  getShapeCollectionMessagesCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import GenericShape from './GenericShape'

class ShapeCollection extends React.Component {

  buildShapes = () => {
    console.log('buildShapes')
    return this.props.shapes.map((shape, index) => {
      if (['rc', 'sh'].includes(shape.type)) {
        return (
          <GenericShape
            key={index}
            name={shape.name}
            properties={shape.properties}
            renderers={this.props.renderers}
            messageTypes={this.props.messageTypes}
          />)
      } else {
        return null
      }
    })
  }

  buildContent = () => {
    return this.buildShapes()
  }

  render() {
    const messageCount = getShapeCollectionMessagesCount(this.props.shapes, this.props.renderers, this.props.messageTypes)
    return (
      <RowContainer
        name={'Group Content'}
        content={this.buildContent}
        messageCount={messageCount}
      />
    );
  }
}

export default ShapeCollection
