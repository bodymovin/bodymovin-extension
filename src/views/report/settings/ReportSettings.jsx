import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import ReportRenderers from './ReportRenderers'
import ReportMessageTypes from './ReportMessageTypes'
import Variables from '../../../helpers/styles/variables'
import BaseButton from '../../../components/buttons/Base_button'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: '100%',
      padding: '10px',
    },
    content: {
      width: '100%',
      height: '100%',
      backgroundColor: Variables.colors.gray,
      borderRadius: '10px',
      padding: '10px',
    },
    renderers: {
      padding: '0 0 10px 0',
    },
    buttons_container: {
      width: '100%',
      height: '50px',
      display: 'flex',
      alignItems:'center'
    },
    button: {
        marginRight:'7px',
        flex: '0 0 auto',
    },
})

class ReportSettings extends React.Component {

  render() {
    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.content)}>
          <ReportRenderers
            renderers={this.props.renderers}
            onRenderersUpdate={this.props.onRenderersUpdate}
          />
          <ReportMessageTypes
            messageTypes={this.props.messageTypes}
            onMessagesUpdate={this.props.onMessagesUpdate}
          />
          <div className={css(styles.buttons_container)}>
              <BaseButton
                text='Done'
                type='green'
                classes={styles.button}
                onClick={this.props.onClose} />
          </div>
        </div>
      </div>
      );
  }
}
export default ReportSettings
