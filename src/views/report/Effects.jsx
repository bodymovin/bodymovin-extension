import React from 'react'
import {
	getEffectsMessageCount,
} from '../../helpers/reports/counter'
import RowContainer from './components/RowContainer'
import Message from './components/Message'

class Effects extends React.Component {

  buildContent = shouldAutoExpand => {
  	return this.props.effects
  		.map((effect, index) => {
  			return <Message
  				key={index}
  				message={effect}
  				renderers={this.props.renderers}
  				messageTypes={this.props.messageTypes}
  				builders={this.props.builders}
  			/>
  		})
  }

  render() {
  	const messageCount = getEffectsMessageCount(this.props.effects, this.props.renderers, this.props.messageTypes, this.props.builders)
  	return (
  		<RowContainer
  			name={'Effects'}
  			content={this.buildContent}
  			messageCount={messageCount}
  			shouldAutoExpand={this.props.shouldAutoExpand}
  		/>
  	);
  }
}

export default Effects
