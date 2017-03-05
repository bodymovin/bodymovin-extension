import { combineReducers } from 'redux'
import compositions from './compositions'
import render from './render'
import project from './project'
import preview from './preview'
import alerts from './alerts'
import paths from './paths'

export default combineReducers({
  compositions,
  render,
  project,
  preview,
  alerts,
  paths
})