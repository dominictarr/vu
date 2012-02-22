/*
  there are a few bugs, but basically, this works.

*/


function ArrayEmitter (ary) {
  this.array = ary || []
}

var aProto = Array.prototype
var proto = ArrayEmitter.prototype = {
  set: function (i, value) {
    this.array.splice(i, 1, value)
    return value
  },
  get: function (i) {
    return this.array[i]
  },
  length: function () {
    return this.array.length
  }
}

//TODO get EventEmitter from node...

function emit(/*emitter, event,...*/) {
  var l = arguments.length, args = new Array(l)
  while (l--) args[l] = arguments[l]
  var emitter = args.shift()
  var event = args.shift()
  var listener = emitter['on'+event]
  if(listener) {
    if('function' == typeof listener) {
      listener.apply(emitter, args)
    } else if(Array.isArray(listener)) {
      listener.forEach(function(l) {
        l.apply(emitter, args)
      })
    }
  }
}


'push,pop,shift,unshift,reverse,sort,splice'
.split(',')
.forEach(function(name) {
  var fun = aProto[name]
    if(!proto[name])
      proto[name] = function () {
        var l = arguments.length, args = new Array(l)
        while (l--) args[l] = arguments[l]
        var r = aProto[name].apply(this.array, args)
        emit(this,'change', name, args)
        return r
      }
  })

'forEach,map,reduce,reduceRight,slice'
.split(',')
.forEach(function(name) {
  var fun = aProto[name]
    if(!proto[name])
      proto[name] = function () {
        var l = arguments.length, args = new Array(l)
        while (l--) args[l] = arguments[l]
        return aProto[name].apply(this.array, args)
      }
  })


//now, make an array like html element...

var EAProto = {
  push: function (v) {
    this.appendChild(v)
    return this.childElementCount
  },
  pop: function () {
//var last = this.children[this.childElementCount - 1]
    this.removeChild(this.lastChild)
    return this.childElementCount
  },
  shift: function () {
    var r = this.firstChild
    this.removeChild(r)
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
    while (del --) {
      removed.push(this.children[at])
      this.removeChild(this.children[at])
    }
    while(args.length)
      this.insertBefore(args.shift(), this.children[at])

    return removed()
  },
  sort: function () {
    //this will need to be handled differently,
    //I want to use this to mirror a array of models,
    //so i just want to move things into their correct 
    //positions, probably will reimplement sort.
    console.error('sort not implemented yet')
  }
}

function List (item) {
  var el = document.createElement('ol')

  //mixin the prototype.
  for (name in EAProto) {
    //(function (fun, name) {
      el[name] = EAProto[name]
    //})(EAProto[name], name)
  }

  el.listener = function (name, args) {
    console.log('received', name, args)
    var l = args.length
    var m = name == 'splice' ? 2 : 0
    while(l-- > m)
      args[l] = item.call(el, args[l])
    el[name].apply(el, args)
  }
  return el
}

