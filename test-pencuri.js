const { getStreams } = require('./providers/pencurimovie.js');

async function test() {
  console.log('Testing PencuriMovie provider...');
  // TMDB ID 872585 = Oppenheimer
  const results = await getStreams('872585', 'movie');
  console.log('Stream jumpa:', results);
}

test();
