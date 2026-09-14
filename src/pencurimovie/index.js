var axios = require("axios");
var cheerio = require("cheerio");
var MANIFEST = {
  id: "org.nuvio.pencurimovie",
  version: "1.0.0",
  name: "PencuriMovie Sub Malay",
  description: "Provider filem dan siri TV dari PencuriMovie",
  resources: ["stream"],
  types: ["movie", "series"],
  idPrefixes: ["tt", "tmdb"]
};
function getStreams(args) {
  return __async(this, null, function* () {
    const { type, id } = args;
    return [];
  });
}
module.exports = { MANIFEST, getStreams };
