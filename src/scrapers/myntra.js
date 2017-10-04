const { Chromeless } = require('chromeless');

module.exports = (url) => {
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
    .wait('.pdp-price')
    .click('.pdp-offers-moreOffersButton')
    .wait('.pdp-offers-price')
    .evaluate(function () {
      try {
        const nameDOM = document.querySelector('.pdp-title');
        const nameHtml = nameDOM.innerHTML.replace(/^\s+|\s+$/g, '');
        const name = nameHtml.replace(/<!--[\s\S]*?-->/g, '').replace(/&nbsp;/g, ' ');

        const priceHtml = document.querySelector('.pdp-price').innerHTML;
        const priceStr = priceHtml.replace('Rs. ', '');
        const price = Number(priceStr);

        const mrpDomRef = document.querySelector('.pdp-discount-container s');
        const mrpHtml = mrpDomRef && mrpDomRef.innerHTML;
        let mrp;
        if (mrpHtml) {
          const mrpStr = mrpHtml.replace(/<!--[\s\S]*?-->/g, '').replace(/,/g, '').replace('Rs. ', '');
          mrp = Number(mrpStr);
        }

        const imageDOM = document.querySelector('.pdp-image-container .thumbnails-selected-image');
        const image = imageDOM.getAttribute('src');

        const bestPriceHtml = document.querySelector('.pdp-offers-price').innerHTML;
        const bestPriceStr = bestPriceHtml.replace(/<!--[\s\S]*?-->/g, '').replace(/,/g, '').replace('Rs ', '');
        const bestPrice = Number(bestPriceStr);

        const couponCode = document.querySelector('.pdp-offers-offerDesc .pdp-offers-boldText').innerHTML;

        return Promise.resolve({
          name,
          price,
          mrp,
          image,
          bestPrice,
          couponCode,
        });
      } catch (e) {
        return Promise.reject(e);
      }
    })
    .end();
}
