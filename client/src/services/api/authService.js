import { config } from './config'
export const authService = {
  login,
  logout,
}

async function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: username, password }),
  }

  const response = await fetch(`${config.apiEndpoint}/auth/login`, requestOptions)
  const user = await response.json()
  if (response.status === 200 && response.ok) return user
  else return undefined
  // store user details and jwt token in local storage to keep user logged in between page refreshes
  // localStorage.setItem('user', JSON.stringify(user))
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
}
