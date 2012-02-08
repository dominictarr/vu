  var vu = require('../')
 
  var page = 

  vu([
    'html',
      ['head', 
        ['title', 'example']
      ],
      ['body', 
        ['h1', 'vu readme example'],
        ['a', {href: 'http://github.com/dominictarr/vu'}, 'fork me on github']
      ]
  ])

  console.log(page())
