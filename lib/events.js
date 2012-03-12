
function EventEmitter () {}
EventEmitter.prototype = {
  listeners: function (event) {
    if(!this._events) this._events = {}
    return this._events[event] = this._events[event] || []
  },
  on: function (event, listener) {
    var listeners = this.listeners(event)
    if(!~listeners.indexOf(listener))
      return listeners.push(listener)
  },
  emit: function (event) {
    var l = arguments.length - 1
    var args = new Array(l)
    while(l--) args[l] = arguments[l + 1]
    var listeners = this.listeners(event)

   for( var x in listeners) {
      listeners[x].apply(null, args)
    }
  },
  removeAllListeners: function (event) {
    if(!event)
      return this._events = {}
    else
      return this._events[event] = null
  },
  removeListener: function (event, listener) {
    var listeners = this.listeners(event)
    do {
    var i = listeners.indexOf(listener)
    if(i != -1)
      listeners.splice(i, 1)
    } while (~i)
  }
}
