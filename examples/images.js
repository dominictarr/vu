var vu = require('../')
  , layout = require('./layout')
  
var kitten = vu(
  ['img', {src: function (x, y) {
    return 'http://placekitten.com/' + x + '/' + y
  }}]
)

console.log(layout(function () {
 var l = 10
 var s = ''
 while (l) {
   s = kitten(l*10,l*10)+s
   --l
 }
 return s
}))
