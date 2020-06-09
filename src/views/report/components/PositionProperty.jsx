import React from 'react'
import {
  getPositionMessageCount
} from '../../../helpers/reports/counter'
import RowContainer from './RowContainer'
import Property from '../Property'

class Position extends React.Component {

  buildContent = shouldAutoExpand => {
    const property = this.props.property
    return [
      <Property
        name={'Position X'}
        key={'X'}
        messages={property.positionX}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        shouldAutoExpand={shouldAutoExpand}
      />,
      <Property
        name={'Position Y'}
        key={'Y'}
        messages={property.positionY}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        shouldAutoExpand={shouldAutoExpand}
      />,
      property.positionZ && 
        <Property
          name={'Position Z'}
          key={'Z'}
          messages={property.positionZ}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          shouldAutoExpand={shouldAutoExpand}
        />
    ]    
  }

  render() {
    const property = this.props.property
    if (!property.dimensionsSeparated) {
      return (
        <Property
          name={'Position'}
          messages={property.position}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          shouldAutoExpand={this.props.shouldAutoExpand}
        />
      )
    } else {
      const messageCount = getPositionMessageCount(this.props.property, this.props.renderers, this.props.messageTypes)
      return (
        <RowContainer
          name={'Position'}
          content={this.buildContent}
          messageCount={messageCount}
          shouldAutoExpand={this.props.shouldAutoExpand}
        />
      );
    }
  }
}

export default Position
