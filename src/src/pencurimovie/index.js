const axios = require('axios');
const cheerio = require('cheerio');

const MANIFEST = {
  id: 'org.nuvio.malayproviders',
  version: '1.0.0',
  name: 'Malay Movie Providers',
  description: 'Provider untuk filem Sub Malay dari PencuriMovie',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt', 'tmdb']
};

async function getStreams(args) {
  const { type, id } = args; 
  const cleanId = id.replace(/^(tmdb:|tt)/, '');

  try {
    // Letak kod skraping axios/cheerio untuk cari link stream PencuriMovie kat sini
    // Contoh asas:
    // const response = await axios.get(`https://pencurimovie.cam/?s=${cleanId}`);
    // const $ = cheerio.load(response.data);
    
    // Untuk permulaan, kalau nak test dulu return array kosong atau link dummy:
    return [];
  } catch (err) {
    console.error('Error fetching streams:', err);
    return [];
  }
}

module.exports = { MANIFEST, getStreams };