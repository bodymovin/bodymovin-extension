import { createSelector } from 'reselect'

const getPaths = (state) => state.paths
const getProjectPath = (state) => state.project.path

const storingPathsSelector = createSelector(
  [ getPaths, getProjectPath ],
  (paths, projectPath) => {
  	return {
      ...paths,
      projectPath,
    }
  }
)

export default storingPathsSelector