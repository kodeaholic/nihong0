import dataConfig from './server.json'
export const config =
  process.env.NODE_ENV === 'production' ? dataConfig['production'] : dataConfig['local']
