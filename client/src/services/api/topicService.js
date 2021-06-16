import { config } from './config'
import { authHeader } from '../helpers/authHelper'
export const topicService = {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopic,
  deleteChapter,
  createChapter,
  updateChapter,
}

async function getTopics(filter, options = { sortBy: 'name:desc', limit: 40, page: 1 }) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/topics?`
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

async function createTopic(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(`${config.apiEndpoint}/topics`, requestOptions)
  const topic = await response.json()
  return topic
}

async function updateTopic(topicId, data) {
  const requestOptions = {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(`${config.apiEndpoint}/topics/${topicId}`, requestOptions)
  const topic = await response.json()
  return topic
}

async function getTopic(topicId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }

  const response = await fetch(`${config.apiEndpoint}/topics/${topicId}`, requestOptions)
  const topic = await response.json()
  if (response.status === 200 && response.ok) return topic
  else {
    return response
  }
}

async function deleteTopic(topicId) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  }

  const response = await fetch(`${config.apiEndpoint}/topics/${topicId}`, requestOptions)
  const topic = await response.json()
  if (response.status === 200 && response.ok) return topic
  else {
    return response
  }
}

async function deleteChapter(topicId, chapterId) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  }
  const response = await fetch(
    `${config.apiEndpoint}/topics/${topicId}/chapters/${chapterId}`,
    requestOptions,
  )
  const topic = await response.json()
  if (response.status === 200 && response.ok) return topic
  else {
    return response
  }
}

async function createChapter(topicId, data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  }
  const response = await fetch(`${config.apiEndpoint}/topics/${topicId}/chapters`, requestOptions)
  const topic = await response.json()
  if (response.status === 200 && response.ok) return topic
  else {
    return response
  }
}

async function updateChapter(topicId, chapterId, data) {
  const requestOptions = {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify(data),
  }

  const response = await fetch(
    `${config.apiEndpoint}/topics/${topicId}/chapters/${chapterId}`,
    requestOptions,
  )
  const topic = await response.json()
  return topic
}
