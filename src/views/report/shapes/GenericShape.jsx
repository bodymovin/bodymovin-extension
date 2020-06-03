import React from 'react'
import {
  getDictionaryMessageCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import Message from '../components/Message'
import Property from '../Property'

class GenericShape extends React.Component {

  buildProperty = (propertyName, messages) => {
    return (
      messages.map((message, index) => (
        <Message 
          key={index}
          message={message}
        />
      ))
    )
  }

  buildContent = () => {
    const properties = this.props.properties
    return (
      <div>
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

  render() {
    const messageCount = getDictionaryMessageCount(
      this.props.properties,
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
