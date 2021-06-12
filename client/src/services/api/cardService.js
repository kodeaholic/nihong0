import { config } from './config'
import { authHeader } from '../helpers/authHelper'
export const cardService = {
  getCards,
  createCard,
  getCard,
  updateCard,
}

async function getCards() {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }

  const response = await fetch(`${config.apiEndpoint}/cards`, requestOptions)
  const res = await response.json()
  if (response.status === 200 && response.ok) {
    return res
  } else return undefined
}

async function createCard(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(`${config.apiEndpoint}/cards`, requestOptions)
  const card = await response.json()
  return card
}

async function updateCard(data, cardId) {
  const requestOptions = {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(`${config.apiEndpoint}/cards/${cardId}`, requestOptions)
  const card = await response.json()
  return card
}

async function getCard(cardId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }

  const response = await fetch(`${config.apiEndpoint}/cards/${cardId}`, requestOptions)
  const card = await response.json()
  if (response.status === 200 && response.ok) return card
  else {
    return response
  }
}
