import { config } from './config'
import { authHeader } from '../helpers/authHelper'
export const subTestService = {
  getItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  findByQuestion,
}

async function getItems(filter, options = { sortBy: 'title:desc', limit: 1000, page: 1 }) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/sub-tests?`
  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      url += `&${key}=${value}`
    }
  }
  for (const [key, value] of Object.entries(options)) {
    url += `&${key}=${value}`
  }
  const response = await fetch(url, requestOptions)
  const res = await response.json()
  if (response.status === 200 && response.ok) {
    return res
  } else return []
}

async function createItem(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(`${config.apiEndpoint}/sub-tests`, requestOptions)
  const item = await response.json()
  return item
}

async function updateItem(data, itemId) {
  const requestOptions = {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(`${config.apiEndpoint}/sub-tests/${itemId}`, requestOptions)
  const item = await response.json()
  return item
}

async function getItem(itemId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }

  const response = await fetch(`${config.apiEndpoint}/sub-tests/${itemId}`, requestOptions)
  const item = await response.json()
  if (response.status === 200 && response.ok) return item
  else {
    return response
  }
}

async function deleteItem(itemId) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  }

  const response = await fetch(`${config.apiEndpoint}/sub-tests/${itemId}`, requestOptions)
  const item = await response.json()
  if (response.status === 200 && response.ok) return item
  else {
    return response
  }
}

async function findByQuestion(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(`${config.apiEndpoint}/sub-tests/findByQuestion`, requestOptions)
  const item = await response.json()
  if (response.status === 200 && response.ok) return item
  else {
    return {}
  }
}
