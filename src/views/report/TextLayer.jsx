import React from 'react'
import {
  getTextMessagesCount,
} from '../../helpers/reports/counter'
import RowContainer from './components/RowContainer'
import TextAnimator from './text/TextAnimator'

class TextLayer extends React.Component {

  buildAnimators = animators => {
    return animators.map((animator, index) => 
      <TextAnimator
        key={index}
        animator={animator}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
      />
    )
  }

  buildContent = () => {
    return [
      this.buildAnimators(this.props.text.animators)
    ]
  }

  render() {
    const messageCount = getTextMessagesCount(this.props.text, this.props.renderers, this.props.messageTypes)
    return (
      <RowContainer
        name={'Text Properties'}
        content={this.buildContent}
        messageCount={messageCount}
      />
    );
  }
}

export default TextLayer
