import React from 'react'
import {
  getPositionMessageCount
} from '../../../helpers/reports/counter'
import Property from '../Property'
import RowContainer from './RowContainer'

class Rotation extends React.Component {

  buildContent = shouldAutoExpand => {
    const property = this.props.property
    return [
      <Property
        name={'Rotation X'}
        key={'X'}
        messages={property.rotationX}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        shouldAutoExpand={shouldAutoExpand}
      />,
      <Property
        name={'Rotation Y'}
        key={'Y'}
        messages={property.rotationY}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        shouldAutoExpand={shouldAutoExpand}
      />,
      <Property
        name={'Rotation Z'}
        key={'Z'}
        messages={property.rotationZ}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        shouldAutoExpand={shouldAutoExpand}
      />,
      <Property
        name={'Orientation'}
        key={'Orientation'}
        messages={property.orientation}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        shouldAutoExpand={shouldAutoExpand}
      />
    ]
  }

  render() {
    const property = this.props.property
    if (!property.isThreeD) {
      return (
        <Property
          name={'Rotation'}
          messages={property.rotation}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
          shouldAutoExpand={this.props.shouldAutoExpand}
        />
      )
    } else {
      const messageCount = getPositionMessageCount(this.props.property, this.props.renderers, this.props.messageTypes)
      return (
        <RowContainer
          name={'Rotation'}
          content={this.buildContent}
          messageCount={messageCount}
          shouldAutoExpand={this.props.shouldAutoExpand}
        />
      )
    }
  }
}

export default Rotation
