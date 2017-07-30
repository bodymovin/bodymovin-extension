import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'

const styles = StyleSheet.create({
  wrapper: {
    height: '10px',
    position: 'absolute',
    bottom:'4px',
    right:'0',
    overflow: 'hidden',
    'font-size': '10px',
    padding: '0 10px',
    color: '#aaa'
  }
})

class Footer extends React.PureComponent {

	render() {
      return (<div className={css(styles.wrapper)}>{'Version: ' + this.props.version}
      </div>)
	}
}

function mapStateToProps(state) {
  return {version: state.project.version}
}

export default connect(mapStateToProps, null)(Footer)