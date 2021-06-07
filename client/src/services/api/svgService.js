import { config } from './config'
export const svgService = {
  getSvg,
}

async function getSvg(svgCode, characterContent) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }

  const response = await fetch(`${config.apiEndpoint}/svg/${svgCode}`, requestOptions)
  const svg = await response.json()
  if (response.status === 200 && response.ok) {
    return {
      svgCode: svgCode,
      htmlEntityCode: `&#${svgCode};`,
      characterContent: characterContent,
      src: `${config.baseUrl}${svg.path}`,
      ...svg,
    }
  } else return undefined
}
