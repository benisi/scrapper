const scrapper = require("./lib/scapper");

const result = {};

scrapper.getContentFromTheInternet("https://wpstandard.com").then(async $ => {
  result.themeName = scrapper.getThemeName($.html());
  result.apps = await scrapper.getShopifyApps($.html());
  console.log(result);
});
