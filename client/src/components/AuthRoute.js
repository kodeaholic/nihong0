import React from 'react'
import { Route, Redirect } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
export const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      !localStorage.getItem('user') ? (
        <Component {...props} />
      ) : (
        // eslint-disable-next-line react/prop-types
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    }
  />
)
