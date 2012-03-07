;(function (exports) {

  function toElement(el) {
     if(!(el instanceof HTMLElement)) {
      var n = document.createElement('label')
      n.innerHTML = '' + el
      return n
    }
    return el
  }

  function replace (newEl, oldEl) {
    if(newEl == null)
      return oldEl
    newEl = toElement(newEl)
    oldEl.parentElement.replaceChild(newEl, oldEl)
    return newEl
  }

  function widget (render) {
    return function (model) {
      var props = {}, elements = {}
      function on (key, render) {
        //what if you want a function that will be called when ANY property updates?
        //i'm thinking rewrite List to use this model.
        props[key] = render || function (v) {
          var el = toElement (v)
          //el.classList.add(key)
          return el
        }
        elements[key] = 
          toElement(props[key].call({init: true},  model.get(key), key, model))
        console.log(props)
        return elements[key]
      }

      var element = render.call(on, model)
      
      element.set = function (key, value) {
        if(!props[key]) return
        var el = elements[key]
        elements[key] =  
          replace(props[key].call(el, value, key, model), el)
      }
      element.get = function (key) {
        if(!elements[key]) return
        return elements[key]
      }
      model.on('change', function (key, value) {
        element.set(key, value)
      })
      //model.on('error', ?
      // if there was a validation error, emit error
      // and maybe call element.set('error:'+key, error)
      return element
    }
  }

  //now, make an array like html element...

var proto = {
  push: function (v) {
    this.appendChild(v)
    return this.childElementCount
  },
  pop: function () {
//var last = this.children[this.childElementCount - 1]
    var l = this.lastChild
    if(l) this.removeChild(l)
    return l
  },
  shift: function () {
    var r = this.firstChild
    if(r) this.removeChild(r)
    return r
  },
  unshift: function (v) {
    this.insertBefore(v, this.firstChild)
    return this.childElementCount
  },
  reverse: function () {
    var l = this.childElementCount
    var tmp = []
    while(l--)
      tmp.push(this.shift())
    while(tmp.length)
      this.unshift(tmp.shift())
    return this
  },
  splice: function (/*at, del, insert...*/) {
    var l = arguments.length, args = new Array(l)
    while (l--) args[l] = arguments[l]
    var at = args.shift()
    var del = args.shift() || 0

    var removed = []
    if(at < 0) at = 0
    if(del < 0) del = 0
    while (del -- && at < this.childElementCount) {
      removed.push(this.children[at])
      this.removeChild(this.children[at])
    }
    while(args.length)
      this.insertBefore(args.shift(), this.children[at])

    return removed
  },
  sort: function () {
    //this will need to be handled differently,
    //I want to use this to mirror a array of models,
    //so i just want to move things into their correct 
    //positions, probably will reimplement sort.
    console.error('sort not implemented yet')
  },
  get: function (i) {
    return this.children[i]
  },
  set: function (i, v) {
    return this.children[i] = v
  },
  length: function () {
    return this.childElementCount
  }
}

//is there a better name than item,
//for the function that renders the item into an element?
//also, this is a bit ugly.
//need to make it feel more consistant with widget.

function List (opts) {
  var item = opts.item || 'function' == typeof opts ? opts : toElement
  //use tagToElement from client.js (so will support tag.class1.class2#id format)
  var el = document.createElement(opts.tag || 'ol')
  if(opts.class) el.classList.add(opts.class)
  if(opts.id) el.setAttribute('id', opts.id)
  //mix in the prototype.
  for (name in proto)
    el[name] = proto[name]

  el.track = function (ae, _item) {
    _item = _item || item
    //ae must be an instanceof ArrayModel
    ae.on('change', listener)
    //create items for each element already in the array
    ae.forEach(function (e) {
      var i = item.call(el, e)
      if(!(i instanceof HTMLElement))
        console.error(i, 'must be instance of HTMLElement')
      el.push(i)
    })
  }

  function listener (name, args) {
   // console.log('received', name, args)
    var l = args.length
    var m = name == 'splice' ? 2 : 0
    while(l-- > m)
      args[l] = item.call(el, args[l])
    el[name].apply(el, args)
  }
  if(opts.track)
    el.track(opts.track, item)
  return el
}

  exports.widget = widget
  exports.List = List
  exports.widgetArray = List

})(window)
