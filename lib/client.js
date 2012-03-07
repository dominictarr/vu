;(function () {

window.parseClass = function parseClass (string) {
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

function isPojo(obj) {
  return (
    'object' == typeof obj
    && !Array.isArray(obj) 
    && !(obj instanceof HTMLElement)
  )
}

function toDom(ary) {

  if(!ary)
    return
  else if('string' == typeof ary) 
    return document.createTextNode(ary)
  else if (ary instanceof HTMLElement)
    return ary

  var l = ary.length, i = 0
  var d = tagToElement(
    'string' == typeof ary[i] 
      ? ary[i++] 
      : 'div'
    )
    
  //if the next element is a regular object...
  if(isPojo(ary[i])) setAttr(d, ary[i++])
  // now, for all other elements,  
  // if the element is string, append it
  while(i <= l) {
    var el = toDom(ary[i++])
    if(el) d.appendChild(el)
  }
  return d
}

window.vu = toDom

})()
