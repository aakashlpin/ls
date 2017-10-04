const url = require('url');

const amazonIn = require('./amazon.in');
const flipkart = require('./flipkart');
const myntra = require('./myntra');

module.exports = (scrapeUrl) => {
  const { host } = url.parse(scrapeUrl);
  switch (host) {
    case 'www.amazon.in':
      return amazonIn(scrapeUrl);
    case 'www.flipkart.com':
      return flipkart(scrapeUrl);
    case 'www.myntra.com':
      return myntra(scrapeUrl);
    default:
      return Promise.reject('Website not supported');
  }
}
