
var test = require('tap').test
var view = require('../')

test('simple', function (t) {

  var div = view(['div', 'hello!'])

  t.equal(typeof div, 'function')
  t.equal(div(), '<div>hello!</div>')
  t.end()
})

test('function', function (t) {

  var div = view(['div', 'hello', function (name) { return ', '+ name }, '!'])

  t.equal(typeof div, 'function')
  t.equal(div('world'), '<div>hello, world!</div>')
  t.end()
})

test('nested', function (t) {

  var div = view(['div', 'hello', ['i', 'jim'], '!'])

  t.equal(typeof div, 'function')
  t.equal(div('world'), '<div>hello<i>jim</i>!</div>')
  t.end()

})


test('nested with function', function (t) {

  var div = view(['div', 'hello', ['i', function (name) { return  name }], '!'])

  t.equal(typeof div, 'function')
  t.equal(div('world'), '<div>hello<i>world</i>!</div>')
  t.end()

})

test('attributes', function (t) {

  var link = view(['a', {href: 'http://sweet.as'}, 'sweet as!'])
  t.equal(link(), '<a href="http://sweet.as">sweet as!</a>')
  t.end()

})

test('contentless', function (t) {

  var img = view(['img', {src: '/images/funny.gif'}])
  t.equal(img(), '<img src="/images/funny.gif"/>')
  t.end()

})

test('attribute function', function (t) {

  var img = view(['img', {src: function (a) { return '/images/'+a }}])
  t.equal(img('not-funny.gif'), '<img src="/images/not-funny.gif"/>')
  t.end()

})

test('default to div', function (t) {

  var div = view([{}, 'hello', ['i', function (name) { return  name }], '!'])

  t.equal(typeof div, 'function')
  t.equal(div('world'), '<div>hello<i>world</i>!</div>')
  t.end()

})