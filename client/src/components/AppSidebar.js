/* eslint-disable react/prop-types */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
  CCreateNavItem,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
const AppSidebar = () => {
  const sidebarShow = useSelector((state) => state.sidebar.sideBarShow)
  const sideBarUnfoldable = useSelector((state) => state.sidebar.sideBarUnfoldable)
  const dispatch = useDispatch()
  return (
    <CSidebar
      position="fixed"
      selfHiding="md"
      unfoldable={sideBarUnfoldable}
      show={sidebarShow}
      onShow={() => {}}
      onHide={() => {}}
      // onClick={() => {
      //   dispatch({ type: 'set', sidebarShow: !sidebarShow })
      // }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" name="logo-negative" height={35} />
        <CIcon className="sidebar-brand-narrow" name="sygnet" height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <CCreateNavItem items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => {
          dispatch({
            type: 'SET_SIDEBAR_UNFOLDABLE',
            payload: { sideBarUnfoldable: !sideBarUnfoldable },
          })
        }}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
