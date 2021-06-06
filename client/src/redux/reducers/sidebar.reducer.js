const initialState = {
  sideBarShow: true,
  sideBarUnfoldable: false,
}
export default function sideBarReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_SIDEBAR_SHOW':
      return {
        ...state,
        sideBarShow: action.payload.sideBarShow,
      }
    case 'SET_SIDEBAR_UNFOLDABLE':
      return {
        ...state,
        sideBarUnfoldable: action.payload.sideBarUnfoldable,
      }
    default:
      return state
  }
}
