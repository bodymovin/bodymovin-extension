import React from 'react'
import {
  getGenericShapeMessagesCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import Property from '../Property'

class GenericShape extends React.Component {



  buildMessages = shouldAutoExpand => {
    return (
      <Property
        name={'General Messages'}
        key={'messages'}
        messages={this.props.shape.messages}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        builders={this.props.builders}
        shouldAutoExpand={shouldAutoExpand}
      />
    )
  }

  buildProperties = shouldAutoExpand => {
    const properties = this.props.shape.properties
    return (
      <div
        key={'properties'}
      >
        {
          Object.keys(properties)
          .map(propertyKey => {
            return <Property
              key={propertyKey}
              name={propertyKey}
              messages={properties[propertyKey]}
              renderers={this.props.renderers}
              messageTypes={this.props.messageTypes}
              builders={this.props.builders}
              shouldAutoExpand={shouldAutoExpand}
            />
          })
        }
      </div>
    )
  }

  buildContent = shouldAutoExpand => {
    return([
      this.buildMessages(shouldAutoExpand),
      this.buildProperties(shouldAutoExpand),
    ])
  }

  render() {
    const messageCount = getGenericShapeMessagesCount(
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

export default GenericShape
