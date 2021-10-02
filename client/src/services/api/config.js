import dataConfig from './server.json'
export const config =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'PRODUCTION'
    ? process.env.HOSTED_PLATFORM && process.env.HOSTED_PLATFORM === 'heroku'
      ? dataConfig['production-heroku']
      : dataConfig['production-own-server']
    : dataConfig['local']
