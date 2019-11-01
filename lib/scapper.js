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

// metadata
const getMetaData = $ => {
  var resObj = {};
  $title = $("head title").text();
  $desc = $('meta[name="description"]').attr("content");
  $kwd = $('meta[name="keywords"]').attr("content");
  $ogTitle = $('meta[property="og:title"]').attr("content");
  $ogImage = $('meta[property="og:image"]').attr("content");
  $ogkeywords = $('meta[property="og:keywords"]').attr("content");
  $images = $("img");

  if ($title) {
    resObj.title = $title;
  }
  console.log(resObj);

  if ($desc) {
    resObj.description = $desc;
  }

  if ($kwd) {
    resObj.keywords = $kwd;
  }

  if ($ogImage && $ogImage.length) {
    resObj.ogImage = $ogImage;
  }

  if ($ogTitle && $ogTitle.length) {
    resObj.ogTitle = $ogTitle;
  }

  if ($ogkeywords && $ogkeywords.length) {
    resObj.ogkeywords = $ogkeywords;
  }

  if ($images && $images.length) {
    resObj.images = [];

    for (var i = 0; i < $images.length; i++) {
      resObj.images.push($($images[i]).attr("src"));
    }
  }
  return resObj;
};

module.exports = {
  getThemeName,
  getShopifyApps,
  getMetaData
};
