/**
 * _template - Built from src/_template/
 * Generated: 2026-09-14T16:14:25.110Z
 */
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// src/providers/pencurimovie.js
var require_pencurimovie = __commonJS({
  "src/providers/pencurimovie.js"(exports2, module2) {
    var cheerio = require("cheerio-without-node-native");
    var axios = require("axios");
    var TMDB_API_KEY = "06379e66c563fece1841e039330e6ee0";
    var BASE_URL = "https://pencurimoviesubmalay26.site";
    function decodeIfBase64(str) {
      if (!str || typeof str !== "string")
        return str;
      if (str.startsWith("http") || str.startsWith("//"))
        return str;
      try {
        const decoded = Buffer.from(str, "base64").toString("utf-8");
        if (decoded.includes("http") || decoded.includes("iframe") || decoded.includes("//")) {
          return decoded;
        }
      } catch (e) {
      }
      return str;
    }
    function fetchServerEmbed(postId, type, nume) {
      return __async(this, null, function* () {
        var _a, _b;
        const actions = ["doo_player_ajax", "zeta_player_ajax", "player_ajax"];
        for (const action of actions) {
          try {
            const formData = new URLSearchParams();
            formData.append("action", action);
            formData.append("post", postId);
            formData.append("type", type);
            formData.append("nume", nume);
            const res = yield axios.post(`${BASE_URL}/wp-admin/admin-ajax.php`, formData, {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": BASE_URL
              },
              timeout: 5e3
            });
            let rawEmbed = ((_a = res.data) == null ? void 0 : _a.embed_url) || res.data;
            if (rawEmbed) {
              let embedUrl = decodeIfBase64(rawEmbed);
              if (typeof embedUrl === "string" && embedUrl.includes("iframe")) {
                const $ = cheerio.load(embedUrl);
                embedUrl = $("iframe").attr("src") || $("iframe").attr("data-src") || $("iframe").attr("data-lazy-src") || embedUrl;
              }
              embedUrl = decodeIfBase64(embedUrl);
              if (typeof embedUrl === "string") {
                if (embedUrl.startsWith("//"))
                  embedUrl = "https:" + embedUrl;
                if (embedUrl.startsWith("http"))
                  return embedUrl;
              }
            }
          } catch (err) {
          }
        }
        try {
          const apiRes = yield axios.get(`${BASE_URL}/wp-json/dooplayer/v2/${postId}/${type}/${nume}`, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
            timeout: 5e3
          });
          let rawApiEmbed = (_b = apiRes.data) == null ? void 0 : _b.embed_url;
          if (rawApiEmbed) {
            let embedUrl = decodeIfBase64(rawApiEmbed);
            if (typeof embedUrl === "string" && embedUrl.includes("iframe")) {
              const $ = cheerio.load(embedUrl);
              embedUrl = $("iframe").attr("src") || embedUrl;
            }
            if (embedUrl.startsWith("//"))
              embedUrl = "https:" + embedUrl;
            if (embedUrl.startsWith("http"))
              return embedUrl;
          }
        } catch (err) {
        }
        return null;
      });
    }
    function getStreams2(tmdbId, mediaType, season, episode) {
      console.log(`[PencuriMovie] Fetching ${mediaType} TMDB ID: ${tmdbId}`);
      const tmdbUrl = mediaType === "tv" ? `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}` : `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`;
      return axios.get(tmdbUrl).then((tmdbRes) => {
        const title = mediaType === "tv" ? tmdbRes.data.name : tmdbRes.data.title;
        if (!title)
          throw new Error("Tajuk tidak dijumpai di TMDB");
        console.log(`[PencuriMovie] Searching title: ${title}`);
        const searchUrl = `${BASE_URL}/?s=${encodeURIComponent(title)}`;
        return axios.get(searchUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        }).then((searchRes) => ({ title, html: searchRes.data }));
      }).then(({ title, html }) => {
        const $ = cheerio.load(html);
        const postLinks = [];
        const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        $("a").each((i, el) => {
          let href = $(el).attr("href");
          if (!href)
            return;
          if (href.startsWith("/")) {
            href = BASE_URL + href;
          }
          if (href.includes("/movies/")) {
            if (href.toLowerCase().includes(titleSlug)) {
              postLinks.unshift(href);
            } else {
              postLinks.push(href);
            }
          }
        });
        if (postLinks.length === 0) {
          throw new Error(`Tiada post filem dijumpai kat PencuriMovie`);
        }
        console.log(`[PencuriMovie] Jumpa post link filem: ${postLinks[0]}`);
        return axios.get(postLinks[0], {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        });
      }).then((pageRes) => __async(this, null, function* () {
        const pageHtml = pageRes.data;
        const $ = cheerio.load(pageHtml);
        const serverItems = [];
        $("#playeroptionsul li, .dooplay_player_option, [data-post][data-nume]").each((i, el) => {
          const postId = $(el).attr("data-post");
          const type = $(el).attr("data-type") || "movie";
          const nume = $(el).attr("data-nume");
          let rawText = $(el).text().replace(/\s+/g, " ").trim();
          const subMatch = rawText.match(/(MalaySub\s*\d*|Full HD)/i);
          const subLabel = subMatch ? subMatch[0].trim() : `Server ${nume}`;
          let hoster = rawText.replace(/MalaySub\s*\d*/gi, "").replace(/Full HD/gi, "").trim();
          if (hoster) {
            hoster = hoster.charAt(0).toUpperCase() + hoster.slice(1);
          }
          const formattedTitle = hoster ? `${hoster} (${subLabel})` : subLabel;
          if (postId && nume) {
            serverItems.push({ postId, type, nume, serverTitle: formattedTitle });
          }
        });
        console.log(`[PencuriMovie] Jumpa ${serverItems.length} server dynamic player. Tengah fetch AJAX...`);
        const streams = [];
        const results = yield Promise.all(
          serverItems.map((srv) => __async(this, null, function* () {
            const embedUrl = yield fetchServerEmbed(srv.postId, srv.type, srv.nume);
            if (embedUrl) {
              return {
                name: "PencuriMovie",
                title: srv.serverTitle,
                url: embedUrl,
                quality: "HD",
                headers: {
                  "Referer": BASE_URL,
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                }
              };
            }
            return null;
          }))
        );
        results.forEach((item) => {
          if (item)
            streams.push(item);
        });
        console.log(`[PencuriMovie] Berjaya extract ${streams.length} live streaming player!`);
        return streams;
      })).catch((err) => {
        console.error("[PencuriMovie] Error:", err.message);
        return [];
      });
    }
    module2.exports = { getStreams: getStreams2 };
  }
});

// src/_template/index.js
var pencuriMovie = require_pencurimovie();
var MANIFEST = {
  id: "org.nuvio.malayproviders",
  version: "1.0.0",
  name: "Malay Movie Providers",
  description: "Provider untuk filem Sub Malay dari PencuriMovie",
  resources: ["stream"],
  types: ["movie", "series"],
  idPrefixes: ["tt"]
};
function getStreams(args) {
  return __async(this, null, function* () {
    const { type, id } = args;
    const tmdbId = id.replace("tmdb:", "");
    if (type === "movie") {
      return yield pencuriMovie.getStreams(tmdbId, "movie");
    }
    return [];
  });
}
module.exports = { MANIFEST, getStreams };
