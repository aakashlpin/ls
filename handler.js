'use strict';
const request = require('request');
const scrape = require('./src/scrapers');

module.exports.add = (event, context, callback) => {
  const { url } = JSON.parse(event.body);
  scrape(url)
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
    json: {},
  }, (requestError, response, body) => {
    callback(requestError, body);
  });
}

module.exports.crawl = (event, context, callback) => {
  const productInfo = JSON.parse(event.body);
  const { url, id, seller } = productInfo;
  scrape(url, seller)
    .then(function (scrapedInfo) {
      request({
        url: `${process.env.ZEIT_SERVER}/api/prices/${id}`,
        method: 'POST',
        json: {
          productInfo: productInfo,
          scrapedInfo: scrapedInfo,
        },
        headers: {
          "Content-type": "application/json",
        },
      }, (requestError, response, body) => {
        callback(requestError, body);
      });
    })
    .catch(function (e) {
      callback(null, e);
    })
}
