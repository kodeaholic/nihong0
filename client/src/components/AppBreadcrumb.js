import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteProperties = (pathname, routes) => {
    const currentRoute = routes.find(
      (route) =>
        route.path === pathname || (route.specificName && pathname.includes(route.specificName)),
    )
    return currentRoute
      ? {
          routeName: currentRoute.name,
          path: currentRoute.path,
          specificName: currentRoute.specificName,
        }
      : {}
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const { routeName, specificName } = getRouteProperties(currentPathname, routes)
      breadcrumbs.push({
        pathname: currentPathname,
        name: routeName,
        active: index + 1 === array.length ? true : false,
        specificName: specificName,
      })
      return currentPathname
    })
    let count = 0
    let specificName
    let mark = 0
    for (let i = 0; i < breadcrumbs.length; i++) {
      if (breadcrumbs[i].specificName) {
        specificName = breadcrumbs[i].specificName
        const splitted = breadcrumbs[i].pathname.split('/')
        if (specificName === splitted[splitted.length - 1]) mark = i
      }
      if (breadcrumbs[i].pathname.includes(specificName)) count++
    }
    if (specificName && count > 1) breadcrumbs.splice(mark, 1)
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem href="/">Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
