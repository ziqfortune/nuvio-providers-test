const pencuriMovie = require('../providers/pencurimovie');

const MANIFEST = {
  id: 'org.nuvio.malayproviders',
  version: '1.0.0',
  name: 'Malay Movie Providers',
  description: 'Provider untuk filem Sub Malay dari PencuriMovie',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt']
};

async function getStreams(args) {
  const { type, id } = args; // id contoh: tmdb:1472152
  const tmdbId = id.replace('tmdb:', '');

  if (type === 'movie') {
    return await pencuriMovie.getStreams(tmdbId, 'movie');
  }
  return [];
}

module.exports = { MANIFEST, getStreams };
