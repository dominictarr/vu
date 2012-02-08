
var vu = require('../')

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