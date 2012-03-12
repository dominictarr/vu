;(function (exports) {

  // this model works well for widgets that do not contain thier own state.
  // many widgets can operate entirely jst by reacting to the events emitted 
  // by the model. some widgets, though, have modes or such like (example: inplace editor)
  // 

  //because I may be assigning alot of listeners
  // this is a easy way to remove them all.
  //no, because I'll need to proxy all the methods also.
/*
  function eventProxy (emitter) {
    function EventProxy () {
      var proto = EventEmitter.prototype
      this.proxyListeners = []
      this.on = function (event, listener) {
        this.proxyListeners.push([event, listener]))
        return proto.on.call(this, event, listener)
      }
      this.clear = function () {
        while(this.proxyListeners.length)
          this.removeListeners.apply(this, this.proxyListener.shift())
      }
    }
    EventProxy.prototype = emitter
    return new EventProxy()
  }
*/
  function widget (render) {
    return function (model) {
      var props = {}, elements = {}, listeners = []
   if(!(model instanceof Model))
      return model
     function onEvent (event, listener) {
       model.on(event, listener)
       listeners.push([event, listener])
     }
 
     function on (key, render) {
        //what if you want a function that will be called when ANY property updates?
        //i'm thinking rewrite List to use this model.
        props[key] = render || function (v) {
          var el = utils.toElement (v)
          //el.classList.add(key)
          return el
        }
        elements[key] = 
          utils.toElement(props[key].call({init: true},  model.get(key), key, model))
        return elements[key]
      }

      var element = render.call(on, model, onEvent)
      
      element.set = function (key, value) {
        if(!props[key]) return
        var el = elements[key]
        elements[key] =  
          utils.replace(props[key].call(el, value, key, model), el)
      }
      element.get = function (key) {
        if(!elements[key]) return
        return elements[key]
      }
      
      onEvent('change', function (key, value) {
        element.set(key, value)
      })
      //model.on('error', ?
      // if there was a validation error, emit error
      // and maybe call element.set('error:'+key, error)
      element.dispose = function () {
        while(listeners.length)
           model.removeListener.apply(model, listeners.shift())
      }
      return element
    }
  }

  //now, make an array like html element...

var proto = {
  forEach: function (f) {
    var l = this.length()
    var i = 0
    while (i < l)
      f(this.get(i), i++, this)
  },
  push: function (v) {
    this.appendChild(v)
    return this.childElementCount
  },
  remove: function (r) {
    if(r) {this.removeChild(r); if('function' == typeof r.dispose) r.dispose()}
    return r
  },
  pop: function () {
//var last = this.children[this.childElementCount - 1]
    return this.remove(this.lastChild)
  },
  shift: function () {
    return this.remove(this.firstChild)
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
      this.remove(this.children[at])
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
    var o = this.children[i]
    if('function' == typeof o.dispose) o.dispose()
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
//TODO make this go both ways,
// so that repositioning the elements moves the data...
// oh, hangon, it's way simpler to have the UI move things on the model.
// then let that bubble up to the UI again.
// that might have to change when I add undo.

function List (opts) {
  var render = opts.item || ('function' == typeof opts ? opts : utils.toElement)

  var el = utils.tagToElement(opts.tag || 'ol')

  //mix in the prototype.
  for (name in proto)
    el[name] = proto[name]

  el.track = function (ae) {
    //ae must be an instanceof ArrayModel
    ae.on('change', listener)
    //create items for each element already in the array
    ae.forEach(function (e) {
      var j = render.call(el, e)
      if(!(j instanceof HTMLElement))
        console.error(j, 'must be instance of HTMLElement')
      el.push(j)
    })
    //cleanup children, incase they are widgets.
    el.dispose = function () {
      el.forEach(function (e) {
        if('function' == typeof e.dispose)
          e.dispose()
      }) 
      ae.removeListener('change', listener)
      //and remove any children?
    }
  }

  function listener (name, args) {
   // console.log('received', name, args)
    var l = args.length
    var m = name == 'splice' ? 2 : 0
    while(l-- > m)
      args[l] = render.call(el, args[l])
    el[name].apply(el, args)
  }
  if(opts.track)
    el.track(opts.track)
  return el
}

  exports.widget = widget
  exports.List = List
  exports.widgetArray = List

})(window)
