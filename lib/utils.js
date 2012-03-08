
;(function (exports) {

  function parseClass (string) {
    var m = string.split(/([\.#]?[a-zA-Z0-9_-]+)/)
      , r = {}
    m.forEach(function (v) {
      var s = v.substring(1,v.length)
      if(!v) return 
      else if (v[0] === '.')
        r.classes = (r.classes ? r.classes + ' ' : '') + s
      else if (v[0] === '#')
        r.id = s
      else
        r.tag = r.tag || v
    })
    r.tag = r.tag || 'div'
    return r 
  }

  function tagToElement(tag) {
    tag = parseClass(tag)
    var d = document.createElement(tag.tag)
    setAttr(d,'id', tag.id)
    setAttr(d,'class', tag.classes)
    return d 
  }

  function setAttr(el, att, value) {
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

  function toElement(el) {
     if(!(el instanceof HTMLElement)) {
      var n = document.createElement('label')
      n.innerHTML = '' + el
      return n
    }
    return el
  }

  function replace (newEl, oldEl) {
    if(newEl == null || newEl === oldEl)
      return oldEl
    newEl = toElement(newEl)
    oldEl.parentElement.replaceChild(newEl, oldEl)
    return newEl
  }



exports.parseClass = parseClass
exports.tagToElement = tagToElement
exports.setAttr = setAttr
exports.toElement = toElement
exports.replace = replace

})(window.utils = {})
