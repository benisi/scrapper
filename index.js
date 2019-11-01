const rp = require("request-promise");
const cheerio = require("cheerio");
const scrapper = require("./lib/scapper");

const userAgent =
  "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36";

const result = {};

const options = {
  uri: "https://themodernshop.com/",
  transform: function(body) {
    return cheerio.load(body);
  },
  headers: {
    "User-Agent": userAgent
  },
  json: true
};

rp(options)
  .then($ => {
    const data = $.html();
    result.themeName = scrapper.getThemeName(data);
    result.appsUrl = scrapper.getShopifyApps(data);
    result.metaDatas = scrapper.getMetaData($);
    console.log(result);
  })
  .catch(error => {
    console.log("Error connecting.........................");
    console.log(error);
  });
