import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../helpers/styles/variables'
import {
  getLayerMessageCount
} from '../../helpers/reports/counter'
import Transform from './Transform'
import RowHeader from './components/RowHeader'

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

  buildContent = () => {
    if (!this.state.isCollapsed) {
      return null
    }
    return (
      <div className={css(styles.content)}>
        <Transform
          transform={this.props.layer.ks}
          renderers={this.props.renderers}
          messageTypes={this.props.messageTypes}
        />
      </div>
    )
  }

  buildHeader = () => {
    const messageCount = getLayerMessageCount(this.props.layer, this.props.renderers, this.props.messageTypes)
    return (
      <RowHeader
        name={this.props.layer.nm}
        isCollapsed={this.state.isCollapsed}
        toggleCollapse={this.toggleCollapse}
        messages={messageCount}
      />
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
