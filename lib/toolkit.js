
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
              m = e
              this.valid = false
            }
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


