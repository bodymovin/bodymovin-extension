import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../helpers/styles/variables'
import {
  getTransformMessageCount
} from '../../helpers/reports/counter'
import Property from './Property'
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
          property={this.props.transform.a}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
        <Property
          name={'Position'}
          property={this.props.transform.p}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
        <Property
          name={'Scale'}
          property={this.props.transform.s}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
        <Property
          name={'Rotation'}
          property={this.props.transform.r}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
        <Property
          name={'Opacity'}
          property={this.props.transform.o}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
      </div>
    )
  }

  render() {
    return (
      <div className={css(styles.wrapper)}>
        {this.buildHeader()}
        {this.buildContent()}
      </div>
      );
  }
}

export default Layer
