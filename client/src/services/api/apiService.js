import config from './config'
export const userService = {
  login,
  logout,
}

async function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }

  const response = await fetch(`${config.apiEndpoint}/auth/login`, requestOptions)
  console.log(response)
  const user = response.user
  // store user details and jwt token in local storage to keep user logged in between page refreshes
  localStorage.setItem('user', JSON.stringify(user))
  return user
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user')
}
