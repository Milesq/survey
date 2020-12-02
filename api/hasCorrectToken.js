const R = require('ramda')

module.exports = tokens => (req, res, next) => {
  const { token } = req.params

  const user = R.find(R.pipe(R.prop('token'), R.equals(token)), tokens)

  if (!user) {
    return res.sendStatus(401)
  }

  req.user = user.name
  next()
}
