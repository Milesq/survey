const fs = require('fs')
const express = require('express')
const _ = require('lodash')
const cors = require('cors')
const { default: ow } = require('ow')
const bodyParser = require('body-parser')
const hasCorrectToken = require('./hasCorrectToken')

const tokens = require('./users.json').map(name => ({
  name,
  token: Math.random().toString(36).substring(2, 15),
}))

fs.writeFileSync('tokens.json', JSON.stringify(tokens, null, 2))

const toLimitate = ['Milosz', 'Marcin', 'Takbylo']
const possibleLimitations = [
  'Niech zostanie tak jak jest',
  'Ograniczenie dostepu',
  'Wydalenie',
]
const managers = [
  'Marcin',
  'Milosz',
  'TakByło',
  'Rada Nadzorcza (Milosz, Marcin, Wojtek, Aleksander)',
]

let bodyTemplate = {
  manager: ow.string.is(answer => managers.includes(answer)),
  limitations: {},
}

toLimitate.forEach(toLimitate => {
  bodyTemplate.limitations[toLimitate] = ow.string.is(
    _.unary(_.bind(Array.prototype.includes, possibleLimitations))
  )
})

bodyTemplate = ow.object.exactShape(bodyTemplate)

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.post('/:token', hasCorrectToken(tokens), (req, res) => {
  const reqIsValid = ow.isValid(req.body, bodyTemplate)
  if (!reqIsValid) {
    return res.sendStatus(400)
  }

  const answers = require('./answers.json')

  answers[req.user] = req.body

  fs.writeFileSync('./answers.json', JSON.stringify(answers, null, 2))

  res.send('ok')
})

app.get('/', (req, res) => {
  const answers = {
    manager: managers,
    limitations: {},
  }

  toLimitate.forEach(toLimitate => {
    answers.limitations[toLimitate] = possibleLimitations
  })

  res.send({
    answers,
    results: JSON.parse(
      fs.readFileSync('./answers.json', { encoding: 'utf-8' })
    ),
  })
})

app.get('/:tokenToCheck', (req, res) => {
  const { tokenToCheck } = req.params
  const exists = tokens.map(({ token }) => token).includes(tokenToCheck)

  res.send({ exists })
})

app.listen(8080, () => console.log('server is running'))
