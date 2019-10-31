const getThemeName = data => {
  const startIndex = /var Shopify = Shopify \|\| {}/g;
  const endIndex = /Shopify.theme.style/g;
  const start = startIndex.exec(data);
  const end = endIndex.exec(data);
  const ThemeData = data.substring(start.index, end.index);
  eval(ThemeData);
  return Shopify.theme.name;
};

const getShopifyApps = data => {
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
  return appsUrl;
};

module.exports = {
  getThemeName,
  getShopifyApps
};
