'use strict';
const request = require('request');
const scrape = require('./src/scrapers');
const qs = require('querystring');

module.exports.add = (event, context, callback) => {
  console.log(event.body);
  const { url } = qs.parse(event.body);
  console.log(qs.parse(event.body));
  scrape(url)
    .then(function (data) {
      console.log(data);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data),
      });
    })
    .catch(function (e) {
      console.log('something bad happened', e);
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
  console.log(productInfo);
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
      });
      callback(null, scrapedInfo);
    })
    .catch(function (e) {
      console.log('issues in crawl', e);
      request({
        url: `${process.env.ZEIT_SERVER}/api/prices/${id}`,
        method: 'POST',
        json: {
          productInfo: productInfo,
        },
        headers: {
          "Content-type": "application/json",
        },
      });

      callback(null, e);
    })
}
