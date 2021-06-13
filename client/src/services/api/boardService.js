import { config } from './config'
import { authHeader } from '../helpers/authHelper'
export const boardService = {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
  checkTagsForCards,
}

async function getBoards(
  filter,
  options = { sortBy: 'title:desc', limit: 40, page: 1, populate: 'cards' },
) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/boards?`
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

async function createBoard(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(`${config.apiEndpoint}/boards`, requestOptions)
  const board = await response.json()
  return board
}

async function updateBoard(data, boardId) {
  const requestOptions = {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(`${config.apiEndpoint}/boards/${boardId}`, requestOptions)
  const board = await response.json()
  return board
}

async function getBoard(boardId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }

  const response = await fetch(`${config.apiEndpoint}/boards/${boardId}`, requestOptions)
  const board = await response.json()
  if (response.status === 200 && response.ok) return board
  else {
    return response
  }
}

async function deleteBoard(boardId) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  }

  const response = await fetch(`${config.apiEndpoint}/boards/${boardId}`, requestOptions)
  const board = await response.json()
  if (response.status === 200 && response.ok) return board
  else {
    return response
  }
}

async function checkTagsForCards(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(`${config.apiEndpoint}/boards/checkTagsForCards`, requestOptions)
  const found = await response.json()
  return found
}
