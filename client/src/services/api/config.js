import config from './server.json'
export const conf = process.env.NODE_ENV === 'production' ? config['production'] : config['local']
