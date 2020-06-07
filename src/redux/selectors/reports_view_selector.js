import { createSelector } from 'reselect'

const getReports = (state) => state.reports

const reportsViewSelector = createSelector(
  [ getReports ],
  (reports) => {
  	return {
  		data: reports.data,
  	}
  }
)

export default reportsViewSelector