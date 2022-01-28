const { resolve } = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const quizApi = require('./quizApi')

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.static(resolve(__dirname, './dist')))
app.use('/api', quizApi)

app.listen(8080, () => console.log('server is running'))
