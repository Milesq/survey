const fs = require('fs')
const express = require('express')
const R = require('ramda')
const cors = require('cors')
const { default: ow } = require('ow')
const bodyParser = require('body-parser')
const hasCorrectToken = require('./hasCorrectToken')

const json = file =>
  JSON.parse(fs.readFileSync(`./${file}.json`, { encoding: 'utf-8' }))

const tokens = json('users').map(name => ({
  name,
  token: Math.random().toString(36).substring(2, 15),
}))

fs.writeFileSync('tokens.json', JSON.stringify(tokens, null, 2))

const bodyTemplate = R.pipe(
  R.flatten,
  // prettier-ignore
  R.map(
    R.juxt([
      R.prop('ask'),
      R.pipe(
        R.prop('responses'),
        arr => ow.string.is(R.includes(R.__, arr)),
      )
    ])
  ),
  R.fromPairs
)(json('questions'))

const app = express()

app.use(bodyParser.json())
app.use(cors())
// prettier-ignore
app.post('/:token', hasCorrectToken(tokens), (req, res) => {
  const reqIsValid = ow.isValid(req.body, ow.object.exactShape(bodyTemplate))
  if (!reqIsValid) {
    return res.sendStatus(400)
  }

  // const answers = json('answers')

  // answers[req.user] = req.body

  // fs.writeFileSync('./answers.json', JSON.stringify(answers, null, 2))

  res.send('ok')
})

app.get('/', (req, res) => {
  res.send({
    questions: json('questions'),
    results: json('answers'),
  })
})

app.get('/:tokenToCheck', (req, res) => {
  const { tokenToCheck } = req.params
  const exists = R.any(R.propEq('token', tokenToCheck))(tokens)

  res.send({ exists })
})

app.listen(8080, () => console.log('server is running'))
