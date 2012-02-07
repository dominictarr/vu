var noClose = ['img', 'br', 'hr']

var flatten = function (array, open, tree) {
  var tag, i = 0, l = tree.length

  open += '<'

  if(typeof tree[i] == 'string') 
    open += (tag = tree[i]), i ++
  else open += (tag = 'div')

  if(typeof tree[i] == 'object' && !Array.isArray(tree[i])){
    var attrs = tree[i]
    for (var k in attrs) {
      var v = attrs[k]
      open += ' '+k+'="'
      if(typeof v == 'string')
        open += v + '"'
      else if (typeof v == 'function') {
        array.push(open)
        array.push(v)
        open = '"'
      }
    }
    i ++
  }
  
  var wontClose = (i == l) && ~noClose.indexOf(tag)
  if(wontClose)
    open += '/'
  open += '>'

  while(i < l) {
    var v = tree[i++]
    if(typeof v == 'string')
      open += v
    else if (typeof v == 'function') {
      array.push(open)
      array.push(v)
      open = ''
    } else if (Array.isArray(v)) {
      open = flatten(array, open, v)
    }
  }  

  if(!wontClose)
    open += '</'+tag+'>'

  if(array.length) 
    array.push(open), open = ''

  return open
}

module.exports = function (tree) {
  var array = []
  var open = ''
  open = flatten(array, open, tree)
  return function () {
    var args = [].slice.call(arguments)
    var r = ''
    if(!array.length) return open
    for (var i in array) {
      if(typeof array[i] == 'string')
        r += array[i]
      else
        r += array[i].apply(null, args)
    }
    return r
  }
}
