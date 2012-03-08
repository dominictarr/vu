
vu.a = function () {//attrs, text, onclick
  var l = arguments.length, args = new Array(l)
  while (l--) args[l] = arguments[l]
  var onclick = args.pop()
  var attrs = ('object' == typeof args[0] ? args.shift() : {})
  attrs.onclick = onclick
  attrs.href = attrs.href || '#'
  args.unshift(attrs)
  args.unshift('a')
  return vu(args)
}


//create a input with validation.
//add a label and a message!
//type, lable, options, validate
//------------
//NO, implement this a different way,
//with validation on the model.
  vu.input = function (opts) {

    opts = opts || {}
    opts.type = opts.type || 'text'
    return function render (value, key, model) {
       opts.onchange = opts.onchange || function () {
        model.set(key, this.value)
      }
     opts.value = value
      if(this.init)
        return vu([ opts.tag || 'input', opts, value ])
      else this.value = value
    //if a value render function returns null that means
    //that it has updated the element, do not replace element.
    }
  }


/*
  inplace editing that works with the new style.
  too complicated!

  since I'm trying to support different uses of render functions.
  so far though, it's seeming that creating a function and then updating it
  is the most good pattern.

  it feels a little like the abstractions around setting values are getting in the way here.

  because, the widget has it's own state.

  or, maybe it's that setting the value is restricted to inside the closure.
  so, it can make a puzzle. for when there is only one right way and it's hard
  to find.

  making the editor shouldn't have to wrangle the
  
  how often do I need to do stuff like this?
  surely most often it's just displaying.

  idea: quickattrs might help here.
*/

vu.edit = function (opts) {
  opts = opts || {}
  var input = opts.input || vu.input({type:'text'})
  var render = opts.render || utils.toElement

  return function (value, key, model) {
    if(this.init) {

      function patch (i, e) {
        i.onclick = function () {
          this.edit(true)
        }
        e.onblur = e.onchange = function () {
          if(model.get(key) != this.value)
            model.set(key, this.value)
          this.edit(false)
        }
      }
       
    var i = render.call({init: true}, value, key, model)
      , e = input.call({init: true}, value, key, model)
      , element = vu(['span.vu-inplace-editor', i, e])

    element.inner = i
    element.input = e

    e.edit = i.edit = element.edit = function (bool) {
      element.inner.style.setProperty('display', bool ? 'none' : 'inline')
      element.input.style.setProperty('display', !bool ? 'none' : 'inline')
      if(bool) element.input.focus()
    }
    patch(i, e)
    element.edit(false)
    return element
  } else {

      this.inner = utils.replace(render.call(this.inner, value, key, model), this.inner)
      this.input = utils.replace(input.call(this.input, value, key, model), this.input)
      patch(this.inner, this.input)
      this.inner.edit = this.input.edit = this.edit
    }
  }
}


vu.edit2 = function (opts) {
  opts = opts || {}
  var value = opts.value || ''
    , get = opts.get || function (){return value}
    , set = 'function' == typeof opts ? opts 
      : (opts.set || function (val) {value = val})
    , render = opts.render || function (v) {
        return document.createTextNode(v)
      }
  function toggleVisible(a,b, inline) {
    a.style.setProperty('display', 'none')
    b.style.setProperty('display', inline || 'inline')
  }

  var label, edit
  var el = 
  vu(['div', {
        onclick: function () {
          el.edit()
        }
      },
      get,      
      edit = vu(['textarea', {
        onblur: function (e) {
          set(this.value)
          el.firstElementChild.update()
          toggleVisible(edit, el.firstElementChild)
        }
      }, 
      value
      ])
    ])
  el.edit = function () {
    toggleVisible(el.firstElementChild, edit)
    edit.focus()
    return edit
  }
  edit.style.setProperty('display', 'none')
  return el
}

