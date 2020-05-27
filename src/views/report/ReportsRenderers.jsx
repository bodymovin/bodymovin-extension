import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import BodymovinCheckbox from '../../components/bodymovin/bodymovin_checkbox'
import checkbox from '../../assets/animations/checkbox.json'
import Variables from '../../helpers/styles/variables'

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
    renderers: {
      alignItems: 'center',
      display: 'flex',
    },
    renderer: {
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

class ReportRenderers extends React.Component {

  state = {
    renderers: [
      {
        id: 'all',
        label: 'All',
        isSelected: true,
      },
      {
        id: 'browser',
        label: 'Browser',
        isSelected: true,
      },
      {
        id: 'skottie',
        label: 'Skottie',
        isSelected: true,
      },
      {
        id: 'ios',
        label: 'iOS',
        isSelected: true,
      },
      {
        id: 'android',
        label: 'Android',
        isSelected: true,
      }
    ]
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.renderers !== this.state.renderers) {
      this.props.onUpdate(this.state.renderers)
    }
  }

  componentDidMount(prevProps, prevState) {
    this.props.onUpdate(this.state.renderers)
  }

  buildRenderer = renderer => {
    return (
      <li
        className={css(styles.renderer)}
        key={renderer.id}
        onClick={() => this.onRendererSelect(renderer)}
      >
        <BodymovinCheckbox animationData={checkbox} animate={renderer.isSelected}>
            <div
              className={css(styles.checkbox)}
              onClick={this.props.toggleItem}
            />
        </BodymovinCheckbox>
        <span className={css(styles.label)}>{renderer.label}</span>
      </li>
    )
  }

  onRendererSelect = selectedRenderer => {
      const newRenderers = this.state.renderers.map(renderer =>
        renderer.id === selectedRenderer.id
        ?  {...renderer, isSelected: !renderer.isSelected}
        :  selectedRenderer.id === 'all'
           ? {...renderer, isSelected: !selectedRenderer.isSelected}
           : renderer.id === 'all' && selectedRenderer.isSelected
             ? {...renderer, isSelected: false}
             : renderer
      )
      this.setState({
        renderers: newRenderers
      })
  }

  render() {
    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.title)}>Get report for:</div>
        <ul className={css(styles.renderers)}>
          {this.state.renderers.map(this.buildRenderer)}
        </ul>
      </div>
      );
  }
}

export default ReportRenderers
