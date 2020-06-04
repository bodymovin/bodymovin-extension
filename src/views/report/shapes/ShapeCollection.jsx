import React from 'react'
import {
  getShapeCollectionMessagesCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import GenericShape from './GenericShape'
import UnhandledShape from './UnhandledShape'
import GroupShape from './GroupShape'
import RepeaterShape from './RepeaterShape'

class ShapeCollection extends React.Component {

  buildShapes = () => {
    return this.props.shapes.map((shape, index) => {
      if (['rc', 'sh', 'el', 'st', 'sr', 'fl'].includes(shape.type)) {
        return (
          <GenericShape
            key={index}
            name={shape.name}
            properties={shape.properties}
            renderers={this.props.renderers}
            messageTypes={this.props.messageTypes}
          />)
      } else if(shape.type === 'un') {
        return <UnhandledShape
          key={index}
          name={shape.name}
          messages={shape.messages}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
      } else if(shape.type === 'gr') {
        return <GroupShape
          key={index}
          name={shape.name}
          shape={shape}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
      } else if(shape.type === 'rp') {
        return <RepeaterShape
          key={index}
          name={shape.name}
          repeater={shape}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
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
