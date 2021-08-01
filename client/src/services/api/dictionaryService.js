import { config } from './config'
import { authHeader } from '../helpers/authHelper'
export const dictionaryService = {
  getItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
}

async function getItems(filter, options = { sortBy: 'letter:desc', limit: 40, page: 1 }) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/dictionary?`
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

  const response = await fetch(`${config.apiEndpoint}/dictionary`, requestOptions)
  const item = await response.json()
  return item
}

async function updateItem(id, data) {
  const requestOptions = {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(`${config.apiEndpoint}/dictionary/${id}`, requestOptions)
  const item = await response.json()
  return item
}

async function getItem(id) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }

  const response = await fetch(`${config.apiEndpoint}/dictionary/${id}`, requestOptions)
  const item = await response.json()
  if (response.status === 200 && response.ok) return item
  else {
    return response
  }
}

async function deleteItem(id) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  }

  const response = await fetch(`${config.apiEndpoint}/dictionary/${id}`, requestOptions)
  const item = await response.json()
  if (response.status === 200 && response.ok) return item
  else {
    return response
  }
}
