/**
 * pencurimovie - Built from src/pencurimovie/
 * Generated: 2026-09-14T16:49:53.207Z
 */
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/pencurimovie/index.js
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
