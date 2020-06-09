import { createSelector } from 'reselect'
import reportsOptionsSelector from './reports_options_selector'

const getReports = (state) => state.reports

const reportsViewSelector = createSelector(
  [ getReports, reportsOptionsSelector ],
  (reports, options) => {
  	return {
  		data: reports.data,
  		settings: reports.settings,
  		options,
  	}
  }
)

export default reportsViewSelector