const fs = require('fs')

function defaultFile(name, value) {
  name = `./data/${name}.json`

  if (!fs.existsSync(name)) {
    fs.writeFileSync(name, value)
  }
}

const files = {
  users: ['John'],
  answers: {},
  questions: [
    [
      {
        ask: 'First Question',
        responses: ['First response', 'Second'],
      },
      {
        ask: 'Second Ask',
        responses: ['qwe', 'abc'],
      },
    ],
    [
      {
        ask: '3rd Question',
        responses: ['First response', 'Second'],
      },
    ],
  ],
}

module.exports = () => {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data')
  }

  Object.entries(files).forEach(([name, content]) => {
    defaultFile(name, JSON.stringify(content, null, 2))
  })
}
