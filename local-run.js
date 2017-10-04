'use strict'
const handler = require('./handler')
handler.add({
  body: "url=https%3A%2F%2Fwww.myntra.com%2Fjeans%2Fwrogn%2Fwrogn-men-black-slim-fit-mid-rise-clean-look-stretchable-jeans%2F2032816%2Fbuy"
}, null, (err, output) => {
  console.log(output)
})
