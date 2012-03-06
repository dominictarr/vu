;(function (exports) {

/*
the heart of this approach is to facillitate the tracking of the model by the view
by giving them a complementary structure, much like I have used with ArrayEmitter.
*/

function Model (init) {
  if('object' == typeof init && init)
    return this.set(init)
}

var proto = Model.prototype = new EventEmitter()

//what about quickattrs ?
//get a(), set a('value')

// also, maybe a white list and blacklist?

proto.set = function (key, value) {
  if(!this.store) this.store = {}
  if('object' == typeof key) {
    for (var i in key)
      this.set(i, key[i])
    return this
  }
      
  var old = this.store[value]
  // might be interesting to allow a listener 
  //emit set, key, value
  // and change, after?
  this.emit('change', key, value)
  this.store[key] = value
  return this
}
proto.get = function (key) {
  if(!this.store) this.store = {}
  return this.store[key]
}

proto.toJSON = function () {
  return this.store()
}

//hydrate function ?
// sometimes it's hard to stop your self getting 
// carried away with what seems like may be a good idea.
// so, add this later when I actually need it.

function ArrayModel (ary) {
  this.array = ary || []
}

var aProto = Array.prototype
var proto = ArrayModel.prototype = new EventEmitter()

proto.set = function (i, value) {
  this.array.splice(i, 1, value)
  this.emit('change', 'set', [i, value])
  return value
}
proto.get = function (i) {
  return this.array[i]
}
proto.length = function () {
  return this.array.length
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
        this.emit('change', name, args)
        return r
      }
  })

'forEach,map,reduce,reduceRight,slice,indexOf'
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

exports.ArrayEmitter = ArrayModel
exports.ArrayModel = ArrayModel
exports.Model = Model

})(window);
