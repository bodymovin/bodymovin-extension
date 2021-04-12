import React from 'react'
import {
	getAnimatorMessageCount,
} from '../../../helpers/reports/counter'
import RowContainer from '../components/RowContainer'
import Property from '../Property'

class TextAnimator extends React.Component {

  buildSelectors = shouldAutoExpand => {
  	const selectors = this.props.animator.selectors
  	return selectors.map((selector, index) => 
  		<Property
  			key={index}
  			name={selector.name}
  			messages={selector.messages}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={this.props.shouldAutoExpand}
  		/>
  	)
  }

  buildContent = shouldAutoExpand => {
  	return [
  		<Property
  			key={'messages'}
  			name={this.props.animator.name}
  			messages={this.props.animator.messages}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={this.props.shouldAutoExpand}
  		/>
  	].concat(this.buildSelectors(shouldAutoExpand))
  }

  render() {
  	const messageCount = getAnimatorMessageCount(this.props.animator, this.props.renderers, this.props.messageTypes, this.props.builders)
  	return (
  		<RowContainer
  			name={this.props.animator.name}
  			content={this.buildContent}
  			messageCount={messageCount}
  			shouldAutoExpand={this.props.shouldAutoExpand}
  		/>
  	);
  }

  render_() {
  	return (
  		<Property
  			name={this.props.animator.name}
  			messages={this.props.animator.messages}
  			renderers={this.props.renderers}
  			messageTypes={this.props.messageTypes}
  			builders={this.props.builders}
  			shouldAutoExpand={this.props.shouldAutoExpand}
  		/>
  	);
  }
}

export default TextAnimator
