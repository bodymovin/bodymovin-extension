import React from 'react'
import {
  getGenericShapeMessagesCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import Property from '../Property'

class GenericShape extends React.Component {



  buildMessages = () => {
    return (
      <Property
        name={'General Messages'}
        key={'messages'}
        messages={this.props.shape.messages}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
      />
    )
  }

  buildProperties = () => {
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
            />
          })
        }
      </div>
    )
  }

  buildContent = () => {
    return([
      this.buildMessages(),
      this.buildProperties(),
    ])
  }

  render() {
    const messageCount = getGenericShapeMessagesCount(
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

export default GenericShape
