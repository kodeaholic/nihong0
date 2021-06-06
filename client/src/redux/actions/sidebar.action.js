export const sidebarActions = {
  setSidebarShow,
}

function setSidebarShow(sideBarShow) {
  const action = { type: 'SET_SIDEBAR_SHOW', payload: { sideBarShow: sideBarShow } }
  return action
}

function setSidebarUnfoldable(unfoldable) {
  return { type: 'SET_SIDEBAR_SHOW', payload: { sideBarShow: unfoldable } }
}
