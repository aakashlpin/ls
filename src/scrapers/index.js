const urlUtil = require('url');

const amazonIn = require('./amazon.in');
const flipkart = require('./flipkart');
const myntra = require('./myntra');

const sellers = {
  amazonIn,
  flipkart,
  myntra,
};

const getSeller = host =>
  Object.keys(sellers).find(seller =>
    host.indexOf(sellers[seller].host) >= 0
  )

module.exports = (url, seller) => {
  if (seller && Object.keys(sellers).indexOf(seller) === -1) {
    return Promise.reject({
      seller, url,
      message: 'unsupported `seller` supplied as arg; this is most likely a data issue in db',
    });
  }

  const _seller = seller || getSeller(urlUtil.parse(url).host);

  if (!_seller) {
    return Promise.reject({ message: 'website/seller invalid', url });
  }

  const { scrape, normalize } = sellers[_seller];

  return new Promise((resolve, reject) =>
    scrape(url).then(data =>
      resolve(Object.assign({}, data, {
        url: normalize(url)
      }))
    ).catch(e => {
      console.log(e);
      reject(e);
    })
  )
}
