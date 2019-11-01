const rp = require("request-promise");
const cheerio = require("cheerio");

const getThemeName = data => {
  const startIndex = /var Shopify = Shopify \|\| {}/g;
  const endIndex = /Shopify.theme.style/g;
  const start = startIndex.exec(data);
  const end = endIndex.exec(data);
  const ThemeData = data.substring(start.index, end.index);
  eval(ThemeData);
  return Shopify.theme.name;
};

const getAppDetails = async urls => {
  const linkArray = [];
  for (let i = 0; i < urls.length; i++) {
    const splitUrl = urls[i].split("//");
    const keyword = splitUrl[1];
    const replaceJs = keyword.replace(".js", "");
    const words = replaceJs.split("/");
    const searchWord = `shopify ${words[0]} ${words[words.length - 1]}`;
    const query = `https://www.google.com/search?q=${searchWord}`;
    const $ = await getContentFromTheInternet(query);
    const link = $('a[href*="https://apps.shopify.com"]').attr("href");
    if (link) {
      const sanitizeLink = link.split(":");
      const l = sanitizeLink[1] || link;
      const url = l.replace(/^\/\//i, "https://");
      const $ = await getContentFromTheInternet(url);
      const appObject = {};
      appObject.name = $(".ui-app-store-hero__header__app-name").text();
      appObject.description = $(".ui-app-store-hero__description").text();
      appObject.icon = $(".ui-app-store-hero__app-icon img").attr("src");
      appObject.url = url;
      linkArray.push(appObject);
    }
  }
  return linkArray;
};

const getContentFromTheInternet = async url => {
  const userAgent =
    "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36";
  const options = {
    uri: url,
    transform: function(body) {
      return cheerio.load(body);
    },
    headers: {
      "User-Agent": userAgent
    }
  };

  const $ = await rp(options);
  return $;
};

const getShopifyApps = async data => {
  let startIndex = /asyncLoad()/g;
  let endIndex = /asyncLoad, false/g;
  let start = startIndex.exec(data);
  let end = endIndex.exec(data);
  const chunk = data.substring(start.index, end.index);
  startIndex = /var urls/g;
  endIndex = /for \(var/g;
  start = startIndex.exec(chunk);
  end = endIndex.exec(chunk);
  const appsArray = chunk.substring(start.index, end.index);
  eval(appsArray);
  const appsUrl = [];
  urls.forEach(app => {
    appsUrl.push(app.replace(/\?(\S+)/, ""));
  });

  return await getAppDetails(appsUrl);
};

module.exports = {
  getThemeName,
  getShopifyApps,
  getContentFromTheInternet
};
