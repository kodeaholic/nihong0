import dataConfig from './server.json'
export const config =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'PRODUCTION'
    ? process.env.REACT_APP_OWN_SERVER && process.env.REACT_APP_OWN_SERVER === 'premise'
      ? dataConfig['production-own-server']
      : dataConfig['production-heroku']
    : dataConfig['local']
