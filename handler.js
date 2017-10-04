'use strict';
const request = require('request');
const qs = require('querystring');
const scrapeAmazon = require('./src/scrapers/amazon.in');

module.exports.add = (event, context, callback) => {
  const { url } = qs.parse(event.body);
  scrapeAmazon(url)
    .then(function (data) {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
      });
    })
    .catch(function (e) {
      callback(null, e);
    });
}

module.exports.run = (event, context, callback) => {
  request({
    url: `${process.env.ZEIT_SERVER}/api/crawl_all`,
    method: 'POST',
    form: {},
  }, (requestError, response, body) => {
    callback(requestError, body);
  });
}

module.exports.crawl = (event, context, callback) => {
  const productInfo = qs.parse(event.body);
  const { url, id } = productInfo;
  scrapeAmazon(url)
    .then(function (scrapedInfo) {
      request({
        url: `${process.env.ZEIT_SERVER}/api/prices/${id}`,
        method: 'POST',
        form: {
          productInfo: productInfo,
          scrapedInfo: scrapedInfo,
        }
      }, (requestError, response, body) => {
        callback(requestError, body);
      });
    })
    .catch(function (e) {
      callback(null, e);
    })
}
