import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import Variables from '../../../helpers/styles/variables'
import BodymovinToggle from '../../../components/bodymovin/bodymovin_toggle'
import expander from '../../../assets/animations/expander.json'
import errorIcon from '../../../assets/svg/error.svg'
import warningIcon from '../../../assets/svg/warning.svg'

const styles = StyleSheet.create({
    title: {
      alignItems: 'center',
      color: Variables.colors.white,
      cursor: 'pointer',
      display: 'flex',
      fontSize: '12px',
    },
    'title-label': {
      flex: '0 0 auto',
    },
    'title-link': {
      color: Variables.colors.green,
      flex: '0 0 auto',
      paddingLeft: '4px',
    },
    'title-arrow': {
      flex: '0 0 auto',

    },
    'title-items': {
      flex: '0 0 auto',
      display: 'flex',
    },
    'title-items--softened': {
      opacity: 0.1,
    },
    'title-item': {
      paddingLeft: '4px',
      fontSize: '12px',
      flex: '0 0 auto',
    },
    'title-space': {
      flex: '1 1 auto',
    },
    'title-icon': {
      width: '14px',
      height: '14px',
      display: 'inline-block',
      marginRight: '4px',
      verticalAlign: 'middle',
    },
    'title-item-number': {
      color: Variables.colors.green,
      fontSize: '14px',
      verticalAlign: 'middle',
      marginRight: '2px',
    },
    'title-image': {
      width: '14px',
      height: '14px',
      display: 'inline-block',
      verticalAlign: 'middle',
    }
})

class RowHeader extends React.Component {

  handleOnSelect = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    this.props.onSelect();
    return false;
  }

  render() {

    const messageCount = this.props.messages

    return (
      <div className={css(styles.title)}
        onClick={this.props.toggleCollapse}
      >
        <BodymovinToggle animationData={expander} toggle={this.props.isCollapsed ? 'on' : 'off'}>
          <div className={css(styles['title-icon'])} />
        </BodymovinToggle>
        <div className={css(styles['title-label'])}>
          {this.props.name}
        </div>
        {this.props.onSelect &&
          <div
          onClick={this.handleOnSelect}
          className={css(styles['title-link'])} >
          go >
          </div>
        }
        <div className={css(styles['title-space'])} />
        <div className={css(styles['title-items'], this.props.isCollapsed && styles['title-items--softened'])}>
          {!!messageCount.error && 
            <div className={css(styles['title-item'])}>
              <span className={css(styles['title-item-number'])}>
                {messageCount.error}
              </span>
              <img
                className={css(styles['title-image'])}
                src={errorIcon}
                alt={'error'}
              />
            </div>
          }
          {!!messageCount.warning && 
            <div className={css(styles['title-item'])}>
              <span className={css(styles['title-item-number'])}>
                {messageCount.warning}
              </span>
              <img
                className={css(styles['title-image'])}
                src={warningIcon}
                alt={'warning'}
              />
            </div>
          }
        </div>
      </div>
      );
  }
}

export default RowHeader
