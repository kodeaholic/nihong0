import { combineReducers } from 'redux'

import { alert } from './alert.reducer'
import { auth } from './auth.reducer'
import sidebar from './sidebar.reducer'
const rootReducer = combineReducers({
  alert,
  auth,
  sidebar,
})

export default rootReducer
