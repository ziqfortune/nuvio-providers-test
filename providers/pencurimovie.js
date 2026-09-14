// providers/pencurimovie.js
const cheerio = require('cheerio-without-node-native');

const TMDB_API_KEY = '06379e66c563fece1841e039330e6ee0'; // Open TMDB API Key
const BASE_URL = 'https://pencurimoviesubmalay26.site';

function getStreams(tmdbId, mediaType, season, episode) {
  console.log(`[PencuriMovie] Fetching ${mediaType} TMDB ID: ${tmdbId}`);

  // 1. Dapatkan tajuk movie/series dari TMDB
  const tmdbUrl = mediaType === 'tv'
    ? `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}`
    : `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`;

  return fetch(tmdbUrl)
    .then(res => res.json())
    .then(tmdbData => {
      const title = mediaType === 'tv' ? tmdbData.name : tmdbData.title;
      if (!title) return [];

      console.log(`[PencuriMovie] Searching title: ${title}`);
      const searchUrl = `${BASE_URL}/?s=${encodeURIComponent(title)}`;

      // 2. Search tajuk kat site Pencuri Movie
      return fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
    })
    .then(res => res ? res.text() : '')
    .then(html => {
      if (!html) return [];
      const $ = cheerio.load(html);
      const postLinks = [];

      // Kumpul URL post hasil carian
      $('article a, .post-title a, h2.entry-title a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes(BASE_URL) && !postLinks.includes(href)) {
          postLinks.push(href);
        }
      });

      if (postLinks.length === 0) return [];

      // 3. Buka post pertama yang jumpa
      return fetch(postLinks[0], {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
    })
    .then(res => res ? res.text() : '')
    .then(pageHtml => {
      if (!pageHtml) return [];
      const $ = cheerio.load(pageHtml);
      const streams = [];

      // 4. Extract iframe / player link dari post
      $('iframe').each((i, el) => {
        let src = $(el).attr('src') || $(el).attr('data-src');
        if (src) {
          if (src.startsWith('//')) src = 'https:' + src;
          
          streams.push({
            name: "PencuriMovie",
            title: `Server ${i + 1} (Sub Malay)`,
            url: src,
            quality: "HD",
            headers: {
              "Referer": BASE_URL,
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
          });
        }
      });

      return streams;
    })
    .catch(err => {
      console.error('[PencuriMovie] Error:', err.message);
      return [];
    });
}

module.exports = { getStreams };
