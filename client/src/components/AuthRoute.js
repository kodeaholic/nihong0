import React from 'react'
import { Route } from 'react-router-dom'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
export const AuthRoute = ({ children, ...rest }) => (
  <Route
    {...rest}
    render={({ location }) =>
      localStorage.getItem('user') ? (
        children
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: location } }} />
      )
    }
  />
)
AuthRoute.propTypes = {
  children: PropTypes.any, // to-do specify this proptype
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
}
