const chai = require("chai");
const scrapper = require("../lib/scapper");

const { expect, should } = chai;
should();

describe("Test for basic scrapper function", () => {
  it("can get theme name", done => {
    const data = `var Shopify = Shopify || {};
        Shopify.shop = "hauslondon.myshopify.com";
        Shopify.currency = {"active":"GBP","rate":"1.0"};
        Shopify.theme = {"name":"Haus London - Production","id":46062277,"theme_store_id":null,"role":"main"};
        Shopify.theme.handle = "null";
        Shopify.theme.style = {"id":null,"handle":null};`;

    const name = scrapper.getThemeName(data);
    expect(name).to.equal("Haus London - Production");
    done();
  });
  it("can get an array of app url", done => {
    const data = `(function() {
      function asyncLoad() {
        var urls = ["\/\/s3.amazonaws.com\/booster-eu-cookie\/hauslondon.myshopify.com\/booster_eu_cookie.js?shop=hauslondon.myshopify.com","\/\/shopify.privy.com\/widget.js?shop=hauslondon.myshopify.com","\/\/cdn.codeblackbelt.com\/js\/modules\/full-page-zoom\/main.min.js?shop=hauslondon.myshopify.com"];
        for (var i = 0; i < urls.length; i++) {
          var s = document.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = urls[i];
          var x = document.getElementsByTagName('script')[0];
          x.parentNode.insertBefore(s, x);
        }
      };
      if(window.attachEvent) {
        window.attachEvent('onload', asyncLoad);
      } else {
        window.addEventListener('load', asyncLoad, false);
      }
    })();`;
    const apps = scrapper.getShopifyApps(data);
    expect(apps).to.be.an("array");
    expect(apps.length).to.equal(3);
    done();
  });
});
