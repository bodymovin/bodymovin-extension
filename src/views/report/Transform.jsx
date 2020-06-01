import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../helpers/styles/variables'
import {
  getTransformMessageCount,
  getTotalMessagesCount,
} from '../../helpers/reports/counter'
import Property from './Property'
import PositionProperty from './components/PositionProperty'
import RotationProperty from './components/RotationProperty'
import RowHeader from './components/RowHeader'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      backgroundColor: Variables.colors.gray,
      padding: '6px 0',
      overflow: 'hidden',
    },
    content: {
      paddingLeft: '4px',
    }
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

  buildHeader = () => {
    const messageCount = getTransformMessageCount(this.props.transform, this.props.renderers, this.props.messageTypes)
    return (
      <RowHeader
        name={'Transform'}
        isCollapsed={this.state.isCollapsed}
        toggleCollapse={this.toggleCollapse}
        messages={messageCount}
      />
    )
  }

  buildContent = () => {
    if (!this.state.isCollapsed) {
      return null
    }
    return (
      <div className={css(styles.content)}>
        <Property
          name={'Anchor Point'}
          messages={this.props.transform.anchorPoint}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
        <PositionProperty
          property={this.props.transform.position}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
        <Property
          name={'Scale'}
          messages={this.props.transform.scale}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
        <RotationProperty
          property={this.props.transform.rotation}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
        <Property
          name={'Opacity'}
          messages={this.props.transform.opacity}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
      </div>
    )
  }

  render() {
    const messageCount = getTransformMessageCount(this.props.transform, this.props.renderers, this.props.messageTypes)
    const totalMessages = getTotalMessagesCount(messageCount)
    if (!totalMessages) {
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
