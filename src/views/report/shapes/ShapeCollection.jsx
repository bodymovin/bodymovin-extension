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

  buildShapes = shouldAutoExpand => {
    return this.props.shapes.map((shape, index) => {
      if(shape.type === 'gr') {
        return <GroupShape
          key={index}
          name={shape.name}
          shape={shape}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          builders={this.props.builders}
          shouldAutoExpand={shouldAutoExpand}
        />
      } else if (['rc', 'el', 'st', 'sh', 'fl', 'sr', 'gf', 'gs', 'rd', 'tm', 'rd', 'mm'].includes(shape.type)) {
        return (
          <GenericShape
            key={index}
            name={shape.name}
            shape={shape}
            renderers={this.props.renderers}
            messageTypes={this.props.messageTypes}
            builders={this.props.builders}
          shouldAutoExpand={shouldAutoExpand}
          />)
      } else if(shape.type === 'un') {
        return <UnhandledShape
          key={index}
          name={shape.name}
          messages={shape.messages}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          builders={this.props.builders}
          shouldAutoExpand={shouldAutoExpand}
        />
      } else if(shape.type === 'rp') {
        return <RepeaterShape
          key={index}
          name={shape.name}
          repeater={shape}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          builders={this.props.builders}
          shouldAutoExpand={shouldAutoExpand}
        />
      } else {
        return null
      }
    })
  }

  buildContent = shouldAutoExpand => {
    return this.buildShapes(shouldAutoExpand)
  }

  render() {
    const messageCount = getShapeCollectionMessagesCount(this.props.shapes, this.props.renderers, this.props.messageTypes, this.props.builders)
    return (
      <RowContainer
        name={'Group Content'}
        content={this.buildContent}
        messageCount={messageCount}
        shouldAutoExpand={this.props.shouldAutoExpand}
      />
    );
  }
}

export default ShapeCollection
