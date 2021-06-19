import { config } from './config'
import { authHeader } from '../helpers/authHelper'
export const chapterService = {
  getChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  getChapter,
}

async function getChapters(
  filter,
  options = { sortBy: 'name:desc', limit: 40, page: 1, populate: 'topic' },
) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/chapters?`
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

async function createChapter(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  }
  let url = `${config.apiEndpoint}/chapters?`
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

async function updateChapter(chapterId, data) {
  const requestOptions = {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify(data),
  }
  let url = `${config.apiEndpoint}/chapters/${chapterId}`
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

async function getChapter(chapterId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/chapters/${chapterId}`
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

async function deleteChapter(chapterId) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/chapters/${chapterId}`
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
