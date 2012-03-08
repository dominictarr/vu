;(function () {

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
  var d = utils.tagToElement(
    'string' == typeof ary[i] 
      ? ary[i++] 
      : 'div'
    )
    
  //if the next element is a regular object...
  if(isPojo(ary[i])) utils.setAttr(d, ary[i++])
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
