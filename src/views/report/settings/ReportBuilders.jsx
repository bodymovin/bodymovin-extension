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
    builders: {
      alignItems: 'center',
    },
    builder: {
      cursor: 'pointer',
      padding: '0 14px 0 0',
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

class ReportBuilders extends React.Component {

  buildBuilder = builder => {
    return (
      <li
        className={css(styles.builder)}
        key={builder.id}
        onClick={() => this.onBuildersSelect(builder)}
      >
        <BodymovinCheckbox animationData={checkbox} animate={builder.isSelected}>
            <div
              className={css(styles.checkbox)}
              onClick={this.props.toggleItem}
            />
        </BodymovinCheckbox>
        <span className={css(styles.label)}>{builder.label}</span>
      </li>
    )
  }

  onBuildersSelect = selectedBuilder => {
      const newBuilders = this.props.builders.map(builder =>
        builder.id === selectedBuilder.id
        ?  {...builder, isSelected: !builder.isSelected}
        :  selectedBuilder.id === 'all'
           ? {...builder, isSelected: !selectedBuilder.isSelected}
           : builder.id === 'all' && selectedBuilder.isSelected
             ? {...builder, isSelected: false}
             : builder
      )
      this.props.onBuildersUpdate(newBuilders)
  }

  render() {
    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.title)}>Get report for:</div>
        <ul className={css(styles.builders)}>
          {this.props.builders.map(this.buildBuilder)}
        </ul>
      </div>
      );
  }
}

export default ReportBuilders
