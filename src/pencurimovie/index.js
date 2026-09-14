const axios = require('axios');
const cheerio = require('cheerio');

const MANIFEST = {
  id: 'org.nuvio.pencurimovie',
  version: '1.0.0',
  name: 'PencuriMovie Sub Malay',
  description: 'Provider filem dan siri TV dari PencuriMovie',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt', 'tmdb']
};

async function getStreams(args) {
  const { type, id } = args;
  // Letak kod logik scraping kau kat sini
  return [];
}

module.exports = { MANIFEST, getStreams };