import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import {goToComps} from '../../redux/actions/compositionActions'

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection:'column',
      padding: '10px 30px',
      backgroundColor :'#474747'
    }
})

class Annotations extends PureComponent {

  render() {
    return (
      <div className={css(styles.container)} >
        Annotation
      </div>
       
      );
  }
}
const mapDispatchToProps = {
  goToComps: goToComps
}

export default connect(null, mapDispatchToProps)(Annotations)
