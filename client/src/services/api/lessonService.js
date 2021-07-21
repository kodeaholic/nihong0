import { config } from './config'
import { authHeader } from '../helpers/authHelper'
export const lessonService = {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getLesson,
  sortVocab,
}

async function getLessons(
  filter,
  options = { sortBy: 'name:desc', limit: 40, page: 1, populate: 'chapter' },
) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/lessons?`
  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      url += `&${key}=${value}`
    }
  }
  for (const [key, value] of Object.entries(options)) {
    url += `&${key}=${value}`
  }
  try {
    const response = await fetch(url, requestOptions)
    const res = await response.json()
    return res
  } catch (e) {
    return {
      failed: true,
    }
  }
}

async function createLesson(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  }
  let url = `${config.apiEndpoint}/lessons`
  try {
    const response = await fetch(url, requestOptions)
    const res = await response.json()
    return res
  } catch (e) {
    return {
      failed: true,
    }
  }
}

async function updateLesson(lessonId, data) {
  const requestOptions = {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify(data),
  }
  let url = `${config.apiEndpoint}/lessons/${lessonId}`
  try {
    const response = await fetch(url, requestOptions)
    const res = await response.json()
    return res
  } catch (e) {
    return {
      failed: true,
    }
  }
}

async function sortVocab(lessonId, data) {
  const requestOptions = {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify(data),
  }
  let url = `${config.apiEndpoint}/lessons/${lessonId}/sortVocab`
  try {
    const response = await fetch(url, requestOptions)
    const res = await response.json()
    return res
  } catch (e) {
    return {
      failed: true,
    }
  }
}

async function getLesson(lessonId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/lessons/${lessonId}`
  try {
    const response = await fetch(url, requestOptions)
    const res = await response.json()
    return res
  } catch (e) {
    return {
      failed: true,
    }
  }
}

async function deleteLesson(lessonId) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/lessons/${lessonId}`
  try {
    const response = await fetch(url, requestOptions)
    const res = await response.json()
    return res
  } catch (e) {
    return {
      failed: true,
    }
  }
}
