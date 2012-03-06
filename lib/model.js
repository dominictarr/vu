;(function (global) {

/*
The purpose of this object is to create a type that can be convienently
tracked by a widget, and that when the object changes, the widget can
be seamlessly updated.

one way to do this is set properties with set(key, value) and
have the listen for a change message, that gets sent to the widget
so it can update.

one way would be to emit 'change:key', value
so that the widget could listen to the key directly.

though, that would require name spaced events.
or, could just emit 'change', key, value, oldValue
but that would require each listener to filter it self.

what about registering listeners with a regexp?

then you get arbitary namespaced events, 
to make it fast, you could cache which regexps match.

okay, I'm really searching two deep.

I would like to have the switching located within the EventEmitter.
what about RegExps, naive first, and optimise later!

so, emit 'change:key', value

ultimately, the whole MVC pattern is just about syncronizing seperated datastructures.

or...
just emit change:key.


################################

ANOTHER APPROACH.

model.post('set', 'key', listener)

... could also have pre('set', 'key', listener)
and allow it to throw, and veto the call. or change the args.
maybe this is a better way... to SYNC datastructures.

so if the objective is to sync datastructures,

what if the widget made a object with and set too?
var widget = 
vu.widget(function (model) {// if the model is replaced, throw away the old widget, creat a new.
  return ['div', {},
    this('key', function (value) { // when a property is updated, just re render this element.
      //render key
    }),
    //NOW, how to handle a validation error? if you try to set a property, and validation fails...
    //maybe, make the model emit an error, and in the widget, have an error listener
    //which calls set('key:error',... on it self)
  ]
})

widget(item) // returns a function that will track changes in the model.

with set(key, value)

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

global.Model = Model

})(window);
