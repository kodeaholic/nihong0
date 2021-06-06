import { userConstants } from '../../constants/user.constants'

// to-do: check localStorage/ redux-persist storage for logged user then assign to initialStage

const initialState = { loggedIn: false, loggingIn: false }

export function auth(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user,
      }
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        loggingIn: false,
        user: action.user,
      }
    case userConstants.LOGIN_FAILURE:
      return {
        loggingIn: false,
      }
    case userConstants.LOGOUT:
      return {}
    default:
      return state
  }
}
