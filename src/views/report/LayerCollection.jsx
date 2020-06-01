import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../helpers/styles/variables'
import {
  getLayerCollectionMessagesCount,
  getTotalMessagesCount,
} from '../../helpers/reports/counter'
import RowHeader from './components/RowHeader'
import Layer from './Layer'

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

class LayerCollection extends React.Component {

  state = {
    isCollapsed: false,
  }

  toggleCollapse = () => {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    })
  }

  buildLayers = () => {
    return this.props.layers.map((layer, index) => (
      <Layer
        key={index}
        layer={layer}
        assets={this.props.assets}
        renderers={this.props.renderers}
        messageTypes={this.props.messageTypes}
      />
    ))
  }

  buildContent = () => {
    if (!this.state.isCollapsed) {
      return null
    }
    return (
      <div className={css(styles.content)}>
        {this.buildLayers()}
      </div>
    )
  }

  buildHeader = () => {
    const messageCount = getLayerCollectionMessagesCount(this.props.layers, this.props.renderers, this.props.messageTypes)
    return (
      <RowHeader
        name={'Composition Layers'}
        isCollapsed={this.state.isCollapsed}
        toggleCollapse={this.toggleCollapse}
        messages={messageCount}
      />
    )
  }

  render() {
    const messageCount = getLayerCollectionMessagesCount(this.props.layers, this.props.renderers, this.props.messageTypes)
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

export default LayerCollection
