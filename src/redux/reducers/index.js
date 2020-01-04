import { combineReducers } from 'redux'
import compositions from './compositions'
import render from './render'
import project from './project'
import preview from './preview'
import alerts from './alerts'
import paths from './paths'
import routes from './routes'
import importer from './importer'

export default combineReducers({
  routes,
  compositions,
  render,
  project,
  preview,
  alerts,
  paths,
  importer,
})