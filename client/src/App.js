import React, { Component } from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import './scss/style.scss'
import { AuthRoute } from './components/AuthRoute'
import { useDispatch } from 'react-redux'
import { authConstants } from './constants/auth.constants'
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            {/* <Route exact path="/login" name="Login Page" render={(props) => <Login {...props} />} /> */}
            <Route exact path="/login">
              {/* {localStorage.getItem('user') ? <Redirect to="/dashboard" /> : <Login />} */}
              <Login />
            </Route>
            <Route exact path="/logout">
              <Logout />
            </Route>
            {/* <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => <Register {...props} />}
            /> */}
            {/* <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} /> */}
            {/* <Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} /> */}
            <AuthRoute path="/" name="Home page">
              <DefaultLayout />
            </AuthRoute>
            {/* <Route path="*" render={(props) => <Page404 {...props} />} /> */}
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

const Logout = () => {
  const dispatch = useDispatch()
  dispatch({ type: authConstants.LOGOUT })
  localStorage.removeItem('user')
  return <Redirect to="/login" />
}

export default App