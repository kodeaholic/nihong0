import { config } from './config'
import { authHeader } from '../helpers/authHelper'
export const vocabService = {
  getVocabs,
  createVocab,
  updateVocab,
  deleteVocab,
  getVocab,
}

async function getVocabs(
  filter,
  options = { sortBy: 'vocab:desc', limit: 40, page: 1, populate: 'lesson' },
) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/vocabs?`
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

async function createVocab(data) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  }
  let url = `${config.apiEndpoint}/vocabs?`
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

async function updateVocab(vocabId, data) {
  const requestOptions = {
    method: 'PATCH',
    headers: authHeader(),
    body: JSON.stringify(data),
  }
  let url = `${config.apiEndpoint}/vocabs/${vocabId}`
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

async function getVocab(vocabId) {
  const requestOptions = {
    method: 'GET',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/vocabs/${vocabId}`
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

async function deleteVocab(vocabId) {
  const requestOptions = {
    method: 'DELETE',
    headers: authHeader(),
  }
  let url = `${config.apiEndpoint}/vocabs/${vocabId}`
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
