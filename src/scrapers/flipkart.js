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
    .wait('._1vC4OE._37U4_g')
    .evaluate(function () {
      try {
        const nameDOM = document.querySelector('._3eAQiD');
        const nameHtml = nameDOM.innerHTML.replace(/^\s+|\s+$/g, '');
        const name = nameHtml.replace(/<!--[\s\S]*?-->/g, '').replace(/&nbsp;/g, ' ');

        const priceHtml = document.querySelector('._1vC4OE._37U4_g').innerHTML;
        const priceStr = priceHtml.replace(/<!--[\s\S]*?-->/g, '').replace(/,/g, '');
        const price = Number(priceStr.substr(1, priceStr.length - 1));

        const mrpHtml = document.querySelector('._3auQ3N._16fZeb').innerHTML;
        const mrpStr = mrpHtml.replace(/<!--[\s\S]*?-->/g, '').replace(/,/g, '');
        const mrp = Number(mrpStr.substr(1, mrpStr.length - 1));

        const imageDOM = document.querySelector('.sfescn');
        const image = imageDOM.getAttribute('src');

        return Promise.resolve({
          name,
          price,
          mrp,
          image,
        });
      } catch (e) {
        return Promise.reject(e);
      }
    })
    .end();

}
