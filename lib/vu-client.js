;(function () {

function toDom(ary) {

   if(!ary)
    return
  var l = ary.length
  var i = 0

  //TODO: 'tag.class1.class2#id' shorthand.
  if('string' == typeof ary) 
    return document.createTextNode(ary)
  else if ('function' == typeof ary) {
    var el = document.createTextNode()
    //lets assume just now that a function will return a string
    el.update = function () {
      //this is the fastest way to make arguments into an array 
      //(note, you cannot pass the arguments object in firefox !)
      var l = arguments.length, args = new Array(l)
      while (l--) args[l] = arguments[l]
      el.textContent = ary.apply(el, args)
    }
    el.update({init: true})
    return el
  } else if (ary instanceof HTMLElement)
    return ary

  var d = document.createElement('string' == typeof ary[i] ? ary[i++] : 'div')
  var updaters = []

  //if the next element is a regular object...
  if('object' == typeof ary[i] && !Array.isArray(ary[i])){
    var attrs = ary[i++]
    for(var key in attrs) {
      var value = attrs[key]
      if('function' == typeof value)
        d[key] = value
      else
        d.setAttribute(key, attrs[key])
    }
  }
  // now, for all other elements,  
  // if the element is string, append it
  while(i <= l) {
    var item = ary[i]
    var el = toDom(item)
    if(el) {
      d.appendChild(el)
      if(el.update)
        updaters.push(el)
    }
    i++
  }
  if(updaters.length)
    d.update = function () {
      var l = arguments.length, args = new Array(l)
      while (l--) args[l] = arguments[l]
      for(var i in updaters)
        updaters[i].update.apply(updaters[el], args)
    }
  return d
}
  
function vu(el, ary) {
  var child
  if(!ary)
   ary = el, el = document.body
  if(Array.isArray(ary)) {
    child = toDom(ary)
    if(el)
      el.appendChild(child)
  }
  return child
}


/*
  handle lists a special way.
  make a special data structure that gives the interface of an array
  but also emits events: now when you use push, pop, splice, shift, unshift, reverse, sort.
  (i.e. the mutating array methods)
  you will be able to mirror that in another array.
  (i.e. an array of widgets)

  should be pretty feasible.
*/
//list(['item', function (v,k,a) {return whatever})

vu.replace = function (el, inner) {
  var parent = el.parentElement
  var el2 = vu(null, inner)
  parent.replaceChild(el2, el) //new node is first.
  return el2
}
vu.br = ['br']

/*
  easy clickable link widget.

  callback in onclick. 
*/
vu.a = function () {
  var l = arguments.length, args = new Array(l)
  while (l--) args[l] = arguments[l]
  var onclick = args.pop()
  var attrs = ('object' == typeof args[0] ? args.shift() : {})
  attrs.onclick = onclick
  attrs.href = attrs.href || '#'
  args.unshift(attrs)
  args.unshift('a')
  return args
}
/*
  another one for an input
  would take a type (text, number, date, check, etc, and a validation function)
  the validation function must return true to signify a valid input.
  falsy means must enter, throwing an error means an invalid entry.

  another one for a form:
    arguments are a list of inputs, and a callback for when they are all validated!
*/

//check if we are on the browser or the server.

window.vu = vu

})()
