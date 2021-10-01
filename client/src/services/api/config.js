import dataConfig from './server.json'
export const config =
  process.env.NODE_ENV === 'production'
    ? process.env.OWN_SERVER
      ? dataConfig['production-own-server']
      : dataConfig['production-heroku']
    : dataConfig['local']
