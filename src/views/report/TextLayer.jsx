import React from 'react'
import {
  getTextMessagesCount,
} from '../../helpers/reports/counter'
import RowContainer from './components/RowContainer'
import TextAnimator from './text/TextAnimator'

class TextLayer extends React.Component {

  buildAnimators = shouldAutoExpand => {
    const animators = this.props.text.animators
    return animators.map((animator, index) => 
      <TextAnimator
        key={index}
        animator={animator}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
        builders={this.props.builders}
        shouldAutoExpand={shouldAutoExpand}
      />
    )
  }

  buildContent = shouldAutoExpand => {
    return [
      this.buildAnimators(shouldAutoExpand)
    ]
  }

  render() {
    const messageCount = getTextMessagesCount(this.props.text, this.props.renderers, this.props.messageTypes, this.props.builders)
    return (
      <RowContainer
        name={'Text Properties'}
        content={this.buildContent}
        messageCount={messageCount}
        shouldAutoExpand={this.props.shouldAutoExpand}
      />
    );
  }
}

export default TextLayer
