'use strict'
const handler = require('./handler')
handler.add({
  body: "url=https%3A%2F%2Fwww.amazon.in%2Fdp%2FB07547QKYR%3Fpsc%3D1"
}, null, (err, output) => {
  console.log(output)
})
