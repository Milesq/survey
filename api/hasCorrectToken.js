module.exports = tokens => (req, res, next) => {
  const { token } = req.params

  const user = tokens.find(({ token: sysToken }) => sysToken === token)

  if (!user) {
    return res.sendStatus(401)
  }

  req.user = user.name
  next()
}
