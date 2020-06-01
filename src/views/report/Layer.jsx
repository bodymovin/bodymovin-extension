import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../helpers/styles/variables'
import {
  getLayerMessageCount,
  getTotalMessagesCount,
} from '../../helpers/reports/counter'
import Transform from './Transform'
import RowHeader from './components/RowHeader'
import Property from './Property'
import LayerCollection from './LayerCollection'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      backgroundColor: Variables.colors.gray,
      padding: '6px 2px',
      overflow: 'hidden',
    },
    content: {
      paddingLeft: '4px',
    },
})

class Layer extends React.Component {

  state = {
    isCollapsed: false,
  }

  toggleCollapse = () => {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    })
  }

  buildMessages = () => (
    <Property
      name={'Layer'}
      messages={this.props.layer.messages}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
    />
  )

  buildTransform = () => (
    <Transform
      transform={this.props.layer.transform}
      renderers={this.props.renderers}
      messageTypes={this.props.messageTypes}
    />
  )

  buildLayerContent = () => {
    if (this.props.layer.type === 0) {
      return (
        <LayerCollection
          layers={this.props.layer.layers}
          assets={this.props.assets}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
      )
    } else {
      return null;
    }
  }

  buildContent = () => {
    if (!this.state.isCollapsed) {
      return null
    }
    return (
      <div className={css(styles.content)}>
        {this.buildMessages()}
        {this.buildTransform()}
        {this.buildLayerContent()}
      </div>
    )
  }

  buildHeader = () => {
    const messageCount = getLayerMessageCount(this.props.layer, this.props.renderers, this.props.messageTypes)
    return (
      <RowHeader
        name={this.props.layer.name}
        isCollapsed={this.state.isCollapsed}
        toggleCollapse={this.toggleCollapse}
        messages={messageCount}
      />
    )
  }

  render() {
    const messageCount = getLayerMessageCount(this.props.layer, this.props.renderers, this.props.messageTypes)
    const totalMessages = getTotalMessagesCount(messageCount)
    if (totalMessages === 0) {
      return null
    }
    return (
      <div className={css(styles.wrapper)}>
        {this.buildHeader()}
        {this.buildContent()}
      </div>
      );
  }
}

export default Layer
