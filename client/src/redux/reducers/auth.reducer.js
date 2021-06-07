import { authConstants } from '../../constants/auth.constants'

// to-do: check localStorage/ redux-persist storage for logged user then assign to initialStage

const initialState = { loggedIn: false, loggingIn: false, user: {} }

export function auth(state = initialState, action) {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return {
        ...state,
        loggingIn: true,
        loggedIn: false,
      }
    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        loggingIn: false,
        user: action.user,
      }
    case authConstants.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: false,
      }
    case authConstants.LOGOUT:
      return { loggedIn: false, loggingIn: false, user: {} }
    default:
      return state
  }
}
