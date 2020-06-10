import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../../helpers/styles/variables'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: '100%',
      padding: '10px',
    },
    content: {
      width: '100%',
      height: '100%',
      backgroundColor: Variables.colors.white,
      borderRadius: '2px',
      color: Variables.colors.gray_darkest,
      fontFamily: 'Roboto-Bold',
      padding: '14px',
      textAlign: 'center',
    }
})

class NoErrorsReport extends React.Component {

  render() {
    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.content)}>
          No errors to report for {this.props.name}
        </div>
      </div>
      );
  }
}
export default NoErrorsReport
