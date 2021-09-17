import React, { Component } from 'react'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import './scss/style.scss'
import { AuthRoute } from './components/AuthRoute'
import { useDispatch } from 'react-redux'
import { authConstants } from './constants/auth.constants'
import PageNotFoundComponent from './components/404'
import ReadingBoardWebView from './views/reading-boards/detail/webview'
import SubTestWebView from './views/sub-tests/detail/webview'
import TrialTestWebView from './views/trial-tests/detail/webview'
import GrammarWebview from './views/grammar/detail/webview'
import NewsWebview from './views/news/detail/webview'
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
const MobileDialogBoard = React.lazy(() => import('./views/dialog-boards/detail/mobile'))
const MobileDialogBoardV2 = React.lazy(() => import('./views/dialog-boards/detail/mobilev2'))
class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route exact path="/login">
              {/* {localStorage.getItem('user') ? <Redirect to="/dashboard" /> : <Login />} */}
              <Login />
            </Route>
            <Route exact path="/logout">
              <Logout />
            </Route>
            <Route
              path="/dialog-boards/mobile/:boardId"
              render={(props) => {
                return (
                  <>
                    <MobileDialogBoard {...props} />
                  </>
                )
              }}
            />
            <Route
              path="/dialog-boards/mobilev2/:boardId"
              render={(props) => {
                return (
                  <>
                    <MobileDialogBoardV2 {...props} />
                  </>
                )
              }}
            />
            <Route
              path="/reading-boards/getBoard/webview/:boardId"
              render={(props) => {
                return (
                  <>
                    <ReadingBoardWebView {...props} />
                  </>
                )
              }}
            />
            <Route
              path="/sub-tests/getSubTest/webview/:itemId"
              render={(props) => {
                return (
                  <>
                    <SubTestWebView {...props} />
                  </>
                )
              }}
            />
            <Route
              path="/trial-tests/getTrialTest/webview/:itemId"
              render={(props) => {
                return (
                  <>
                    <TrialTestWebView {...props} />
                  </>
                )
              }}
            />
            <Route
              path="/grammar/getGrammar/webview/:itemId"
              render={(props) => {
                return (
                  <>
                    <GrammarWebview {...props} />
                  </>
                )
              }}
            />
            <Route
              path="/news/getNews/webview/:itemId"
              render={(props) => {
                return (
                  <>
                    <NewsWebview {...props} />
                  </>
                )
              }}
            />
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
