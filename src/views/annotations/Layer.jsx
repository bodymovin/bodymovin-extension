import React, {PureComponent} from 'react'
import { StyleSheet, css } from 'aphrodite'
import AnnotationItem from './AnnotationItem'
import Variables from '../../helpers/styles/variables'

const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      height: '100%',
      padding: '10px 0',
    },
    layerInfo: {
      width: '100%',
      'background-color': Variables.colors.white,
      padding: '4px 2px',
      color: Variables.colors.gray,
    }
})

class Layer extends PureComponent {

  activateAnnotations = matchName => {
    this.props.onActivateAnnotations(this.props.id, matchName)
  }

  checkActive = annotation => {
    const isActive = !!this.props.activeAnnotations.find(
      activeAnnotation => activeAnnotation.matchName === annotation.matchName
    )
    return isActive
  }

  buildAnnotationsList() {
    const availableAnnotations = this.props.availableAnnotations
    return availableAnnotations.map(annotation => {
      return (
        <AnnotationItem
          isActive={this.checkActive(annotation)}
          key={annotation.matchName}
          onSelect={() => this.activateAnnotations(annotation.matchName)}
          data={annotation}
        />
      )
    })
  }

  render() {
    return (
      <div
        className={css(styles.wrapper)}
      >
        <div
          className={css(styles.layerInfo)}
        >{this.props.name}

        </div>
        {this.buildAnnotationsList()}
      </div>
      );
  }


}

export default Layer
