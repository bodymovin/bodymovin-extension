import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../../helpers/styles/variables'
import RowHeader from './RowHeader'
import {
  getTotalMessagesCount,
} from '../../../helpers/reports/counter'

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

class RowContainer extends React.Component {

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
      this.props.content()
    )
  }

  buildHeader = () => {
    return (
      <RowHeader
        name={this.props.name}
        isCollapsed={this.state.isCollapsed}
        toggleCollapse={this.toggleCollapse}
        messages={this.props.messageCount}
      />
    )
  }

  render() {
    const totalMessages = getTotalMessagesCount(this.props.messageCount)
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

export default RowContainer
