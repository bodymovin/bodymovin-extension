import React from 'react'
import {
  getEffectsMessageCount,
} from '../../helpers/reports/counter'
import Property from './Property'
import RowContainer from './components/RowContainer'
import Message from './components/Message'

class Effects extends React.Component {

  buildContent = () => {
    return this.props.effects
    .map((effect, index) => {
      return <Message
        key={index}
        message={effect}
      />
    })
  }

  render() {
    const messageCount = getEffectsMessageCount(this.props.effects, this.props.renderers, this.props.messageTypes)
    return (
      <RowContainer
        name={'Effects'}
        content={this.buildContent}
        messageCount={messageCount}
      />
    );
  }
}

export default Effects
