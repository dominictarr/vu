# vu

a js html templater in ~70 lines

#examples

`vu` takes a tree of arrays and returns a function that returns html.

```
  var vu = require('vu')
 
  var page = 

  vu([
    'html',
      ['head', 
        ['title', 'example']
      ],
      ['body', 
        ['h1', 'vu readme example']
        ['a', {href: 'http://github.com/dominictarr/vu'}, 'fork me on github']
      ]
  ])

  console.log(page())

```

why does `vu` return a function?  
so that you can do this:

```
  var kitten = vu(
    ['img', {src: function (x, y) {
      return 'http://placekitten.com/' + x + '/' + y
    }}]
  )

  console.log(kitten(100,100))
```

the arguments passed to the returned function will be passed in turn to  
the inner functions!  

you could use this to create a layout system, maybe something like this...

```
  var layout = 
    vu([
      'html',
        ['head', 
          ['title', 'vu layout example']
        ],
        ['body', 
          function (body, data) {
            return body(data)
          }
        ]
    ])

  module.exports = layout

```
 