import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BodymovinCheckbox from '../../../components/bodymovin/bodymovin_checkbox'
import checkbox from '../../../assets/animations/checkbox.json'
import Variables from '../../../helpers/styles/variables'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      backgroundColor: Variables.colors.gray,
      padding: '6px 2px',
      overflow: 'hidden',
    },
    title: {
      color: Variables.colors.white,
      marginBottom: '10px',
    },
    messages: {
      alignItems: 'center',
      display: 'flex',
    },
    message: {
      cursor: 'pointer',
      flex: '0 0 auto',
      padding: '0 12px 0 0',
    },
    checkbox: {
      width: '16px',
      height: '16px',
      display: 'inline-block',
      verticalAlign: 'middle',
    },
    label: {
      color: Variables.colors.white,
      paddingLeft: '4px',
      verticalAlign: 'middle',
    }
})

class ReportMessages extends React.Component {

  buildMessage = message => {
    return (
      <li
        className={css(styles.message)}
        key={message.id}
        onClick={() => this.onMessageSelect(message)}
      >
        <BodymovinCheckbox animationData={checkbox} animate={message.isSelected}>
            <div
              className={css(styles.checkbox)}
            />
        </BodymovinCheckbox>
        <span className={css(styles.label)}>{message.label}</span>
      </li>
    )
  }

  onMessageSelect = selectedMessage => {
      const newMessages = this.props.messageTypes.map(message =>
        message.id === selectedMessage.id
        ?  {...message, isSelected: !message.isSelected}
        :  selectedMessage.id === 'all'
           ? {...message, isSelected: !selectedMessage.isSelected}
           : message.id === 'all' && selectedMessage.isSelected
             ? {...message, isSelected: false}
             : message
      )
      this.props.onMessagesUpdate(newMessages)
  }

  render() {
    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.title)}>Select message types:</div>
        <ul className={css(styles.messages)}>
          {this.props.messageTypes.map(this.buildMessage)}
        </ul>
      </div>
      );
  }
}

export default ReportMessages
