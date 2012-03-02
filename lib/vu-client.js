;(function () {

//parse something of the form 'tagname.class1.class2#id
window.parseClass = function parseClass (string) {
  var m = string.split(/([\.#]?[a-zA-Z0-9_-]+)/)
    , r = {}
  m.forEach(function (v) {
    var s = v.substring(1,v.length)
    if(!v) return 
    else if (v[0] === '.')
      r.classes += (r.classes ? ' ' : '') + s
    else if (v[0] === '#')
      r.id = s
    else
      r.tag = r.tag || v
  })
  r.tag = r.tag || 'div'
  return r 
}

function setAttr(el, att, value) {
  console.log(el, att, value)
  function sa(a, v) {
    if('function' === typeof v)
      el[a] = v 
    else if(v !== undefined)
      el.setAttribute(a, v)
  }
  if('object' == typeof att)
    for(var a in att) 
      sa(a, att[a])
  else
    sa(att, value)
}

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
    //lets assume just now that the function will return a string
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
  var d

  if('string' == typeof ary[0]) {
    var tag = parseClass(ary[i++])
    d = document.createElement(tag.tag)
    setAttr(d,'id', tag.id)
    setAttr(d,'class', tag.classes)
  }
  var updaters = []

  //if the next element is a regular object...
  if('object' == typeof ary[i] && !Array.isArray(ary[i])) {
    var attrs = ary[i++]
    setAttr(d, attrs)
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

vu.replace = function (el, inner) {
  var parent = el.parentElement
  var el2 = vu(null, inner)
  parent.replaceChild(el2, el) //new node is first.
  return el2
}
vu.br = ['br']

/*
  clickable link widget.
  callback is onclick. 
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

//create a input with validation.
//add a label and a message!
//type, lable, options, validate

vu.input = function (type, label, opts, validate) {
  if('function' == typeof opts)
    validate = opts, opts = {}
  if(!validate)
    validate = function () {return true}
  type = parseClass(type)
  var input = document.createElement(type.tag)
  var message 
  var around =
    vu(
    ['div', {id: type.id, class: type.classes},
      ['label', label],
      ['input', {
        type: type.tag, 
        onchange:  
          function(e) {
            var m
            try {
              this.valid = validate(this.value)
            } catch (e) {
              console.log(e)
              m = e
              this.valid = false
            }
            console.log('VALID')
            if('function' == typeof this.onvalidate)
              this.onvalidate(this.valid, m)
          },
        onvalidate: 
          function (valid, m) {
            message.textContent = valid ? '' : m
          }
        }
      ],
      message = vu(['label.message'])  
  ])

  return around
}

/*
  another one for an input
  would take a type (text, number, date, check, etc, and a validation function)
  the validation function must return true to signify a valid input.
  falsy means must enter, throwing an error means an invalid entry.

  another one for a form:
    arguments are a list of inputs, and a callback for when they are all validated!
*/

vu.edit = function (opts) {
  opts = opts || {}
  var value = opts.value || ''
    , get = opts.get || function (){return value}
    , set = 'function' == typeof opts ? opts : function (val) {console.log('set:', val); value = val}


  function toggleVisible(a,b, inline) {
    a.style.setProperty('display', 'none')
    b.style.setProperty('display', inline || 'inline')
  }

  var label, edit
  var el = 
  vu(['span', 
      ['label', {
        onclick:  function () {
          toggleVisible(label, edit)
          edit.focus()
        }
      },
      get
      ],
      ['textarea', {
        onchange: function (e) {
          console.log(e.textContent)
          set(this.value)
          label.update()
          toggleVisible(edit, label)
        }
      }, 
      value
      ]
    ])
  label = el.children[0]
  edit = el.children[1]
 edit.style.setProperty('display', 'none')
  return el
}

//check if we are on the browser or the server.

window.vu = vu

})()
