import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppBreadcrumb } from './index'

import { AppHeaderDropdown } from './header/index'
import { sidebarActions } from '../redux/actions/sidebar.action'
const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebar.sideBarShow)
  const currentLocation = useLocation().pathname
  return (
    <CHeader position="sticky" className="mb-4">
      {!currentLocation.includes('topics') && (
        <>
          <CContainer fluid>
            <AppBreadcrumb />
          </CContainer>
        </>
      )}
    </CHeader>
  )
}

export default React.memo(AppHeader)
