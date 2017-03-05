import compositions from './composition_sagas'
import project from './project_sagas'
import preview from './preview_sagas'
import render from './render_sagas'

export default function* rootSaga() {
  yield [
  	compositions,
  	project,
  	preview,
  	render
  ]
}