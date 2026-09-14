const { getStreams } = require('./providers/pencurimovie.js');

async function test() {
  console.log('Testing PencuriMovie provider...');
  // ID 1472152 = Balas Balik
  const results = await getStreams('1472152', 'movie');
  console.log('Hasil Stream:', results);
}

test();