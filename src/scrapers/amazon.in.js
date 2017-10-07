const { Chromeless } = require('chromeless');

module.exports = {
  host: 'amazon.in',

  scrape: (url) => {
    const chromeless = new Chromeless({
      remote: {
        apiKey: process.env.CHROMELESS_API_KEY,
        endpointUrl: process.env.CHROMELESS_ENDPOINT,
      }
    });

    return chromeless
      .setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36")
      .setViewport({ width: 990, height: 400, scale: 1 })
      .goto(url)
      .evaluate(function () {
        try {
          const allPriceDomSelectors = ['#priceblock_dealprice', '#priceblock_ourprice',
            '#priceblock_saleprice', '#buyingPriceValue', '#actualPriceValue',
            '#priceBlock', '#price', '#buyNewSection .offer-price'];

          const allTitleDomSelectors = ['#productTitle', '#btAsinTitle > span', '#btAsinTitle'];

          const allImageDomSelectors = ['#imgTagWrapperId > img', '#landingImage', '#prodImage', '#kib-ma-container-0 > img', '#imgBlkFront'];

          /**
           * get title/name
           */
          const nameDomSelector = allTitleDomSelectors.find(
            selector => document.querySelector(selector)
          );

          const nameDomRef = document.querySelector(nameDomSelector);
          const name = nameDomRef.innerHTML.replace(/^\s+|\s+$/g, '').replace(/&nbsp;/g, ' ');

          /**
           * get price
           */
          const priceDomSelector = allPriceDomSelectors.find(
            selector => document.querySelector(selector)
          );

          const priceDomRef = document.querySelector(priceDomSelector);
          const priceHtml = priceDomRef.innerHTML;

          // if (priceDomRef.id === 'kindle_meta_binding_winner') {

          // }

          const priceStr = priceHtml.replace(/<span[\s\S]*?<\/span>/g, '').replace(/,/g, '').replace(/\s/, '');

          const price = Number(priceStr);

          /**
           * get image
           */
          const imageDOM = document.querySelector('#imgTagWrapperId > img');
          const image = imageDOM.getAttribute('data-old-hires') || imageDOM.getAttribute('src');

          return Promise.resolve({
            name,
            price,
            image,
            seller: 'amazonIn',
          });
        } catch (e) {
          return Promise.reject(e);
        }
      })
      .end();
  },

  normalize: (url) => {
    const asin = url.match('/([a-zA-Z0-9]{10})(?:[/?]|$)');
    if (asin && asin[1]) {
      return `http://www.amazon.in/dp/${asin[1]}`;
    }
    return url;
  }
}
