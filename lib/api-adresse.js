import HttpError from './http-error'
import getConfig from 'next/config'

const {NEXT_PUBLIC_API_ADRESSE: API_ADRESSE} = getConfig().publicRuntimeConfig

if (!API_ADRESSE) {
  throw new Error('API_ADRESSE is not defined in the environment')
}

async function _fetch(url) {
  const options = {
    mode: 'cors',
    method: 'GET'
  }

  const response = await fetch(url, options)
  const contentType = response.headers.get('content-type')

  if (!response.ok) {
    throw new HttpError(response)
  }

  if (response.ok && contentType && contentType.includes('application/json')) {
    return response.json()
  }

  throw new Error('Une erreur est survenue')
}

export function isFirstCharValid(string) {
  return (string.slice(0, 1).toLowerCase() !== string.slice(0, 1).toUpperCase()) || (string.codePointAt(0) >= 48 && string.codePointAt(0) <= 57)
}

export function search(args) {
  const {q, limit, lng, lat} = args
  let url = `${API_ADRESSE}/search/?q=${encodeURIComponent(q)}`

  if (lng && lat) {
    url += `&lng=${lng}&lat=${lat}`
  }

  if (limit) {
    url += `&limit=${limit}`
  }

  return _fetch(url)
}

export function reverse(coordinates) {
  const lng = coordinates[0]
  const lat = coordinates[1]
  const url = `${API_ADRESSE}/reverse/?lng=${lng}&lat=${lat}`

  return _fetch(url)
}

export async function geocodeCsv(inputFile, filters, columns) {
  class GeocodeError extends Error {
    constructor(status, message) {
      super(message)
      this.httpCode = status
    }
  }

  // Build request
  const requestBody = new FormData()
  columns.forEach(c => requestBody.append('columns', c))
  filters.forEach(f => requestBody.append(f.name, f.value))
  requestBody.append('data', inputFile)

  // Execute request + handle response
  const response = await fetch(`${API_ADRESSE}/search/csv/`, {method: 'POST', body: requestBody})

  if (response.ok) {
    return response.blob()
  }

  switch (response.status) {
    case 400:
      throw new GeocodeError(response.status, 'Une erreur dans le formatage des données rend l’opération impossible. Veuillez vous rapprocher de notre équipe avec un échantillon minimal qui reproduit le problème.')
    case 502:
    case 503:
      throw new GeocodeError(response.status, 'Le service est actuellement surchargé. Merci de réessayer dans quelques minutes')
    default:
      throw new GeocodeError(response.status, 'Une erreur inconnue est survenue. N’hésitez pas à réessayer ultérieurement et à revenir vers nous le cas échéant.')
  }
}
