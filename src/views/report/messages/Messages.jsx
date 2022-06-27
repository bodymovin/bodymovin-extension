import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import messageTypes from '../../../helpers/enums/messageTypes'
import alertAnim from '../../../assets/animations/alert.json'
import Bodymovin from '../../../components/bodymovin/bodymovin'
import Variables from '../../../helpers/styles/variables'
import BaseButton from '../../../components/buttons/Base_button'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '10px',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    alertMessage: {
      flex: '0 0 auto',
      width: '100%',
      backgroundColor: Variables.colors.white,
      borderRadius: '2px',
      color: Variables.colors.gray_darkest,
      fontFamily: 'Roboto-Bold',
      padding: '14px',
      textAlign: 'center',
    },
    alertAnim: {
      flex: '1 1 auto',
      width: '100%',
      height: '100%',
      'min-height': 0,
    },
    alertButton: {
      width: '100%',
      flex: '0 0 auto',
      textAlign: 'center',
      marginTop: '10px',
    },
})

class Messages extends React.Component {

  buildNoMessage = () => {
    return null
  }

  buildAlertMessage = message => {
    return (
      <div className={css(styles.wrapper)}>
        <Bodymovin autoplay={true} loop={true} animationData={alertAnim}>
          <div className={css(styles.alertAnim)}></div>
        </Bodymovin>
        <div className={css(styles.alertMessage)}>
          {message.text}
        </div>
        <div className={css(styles.alertButton)}>
          <BaseButton
            text='OK'
            type='green'
            onClick={this.props.onDismiss} />
        </div>
      </div>
    )
  }

  messageStrategies = {
    [messageTypes.NONE]: this.buildNoMessage,
    [messageTypes.ALERT]: this.buildAlertMessage,
  }

  buildMessage = message => {
    if (this.messageStrategies[message.type]) {
      return this.messageStrategies[message.type](message);
    } else {
      return this.buildNoMessage()
    }
  }

  render() {
    return (
      this.buildMessage(this.props.message)
    );
  }
}

export default Messages
