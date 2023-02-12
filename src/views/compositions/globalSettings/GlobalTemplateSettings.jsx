import React from 'react'
import {connect} from 'react-redux'
import { StyleSheet, css } from 'aphrodite'
import BaseButton from '../../../components/buttons/Base_button'
import BaseLink from '../../../components/buttons/Base_Link'
import Variables from '../../../helpers/styles/variables'
import selector from '../../../redux/selectors/global_settings_template_selector'
import {
	toggleCompNameAsDefault,
	deleteTemplate,
	loadTemplate,
} from '../../../redux/actions/compositionActions'

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: '10px',
    border: `1px solid ${Variables.colors.gray_lighter}`,
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'green',
    fontSize: '16px',
  },
  content: {
    width: '100%',
    flex: '1 1 auto',
    padding: '10px 0',
    'overflow-y': 'auto',
  },
  templatesList: {
    padding: '4px 0',
  },
  templatesListItem: {
    width: '100%',
    fontSize: '12px',
    color: '#ffffff',
    backgroundColor: Variables.colors.gray_darkest,
    height: '50px',
    marginBottom: '2px',
    ':hover': {
      background: Variables.gradients.blueGreen,
    }
  },
  templatesListItemContainer: {
    padding: '4px 4px',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
})

class GlobalTemplateSettings extends React.Component {
  
  render() {
    const {
      templates,
    } = this.props;
    return (
      <div className={css(styles.wrapper)}>
        <div className={css(styles.header)}>
          <div className={css(styles.headerTitle)}>Blueprints</div>
          <BaseButton
              text='Add Blueprint'
              type='gray'
              classes={styles.button}
              onClick={this.props.loadTemplate}
          />
        </div>
        <div className={css(styles.content)}>

          <ul className={css(styles.templatesList)}>
            {templates.list.map(template => {
              return (
                <li  className={css(styles.templatesListItem)} key={template.value}>
                  <div className={css(styles.templatesListItemContainer)} >
                    <div>{template.text}</div>
                    <BaseLink
                        text='Delete'
                        type='green'
                        classes={styles.right}
                        onClick={() => this.props.onTemplateDelete(template.value)}
                        selected={false}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
	onCompNameAsDefaultToggle: toggleCompNameAsDefault,
	loadTemplate: loadTemplate,
	onTemplateDelete: deleteTemplate,
}

export default connect(selector, mapDispatchToProps)(GlobalTemplateSettings)
