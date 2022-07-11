const jwt = require('jsonwebtoken')
const { UnauthenticateError } = require('../errors')

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticateError('Authentication invalid')
  }

  const token = authHeader.split(' ')[1]

  try {
    const verify = await jwt.verify(token, process.env.JWT_SECRET)
    req.user = { userId: verify.userId, name: verify.name }
    next()
  } catch (error) {
    throw new UnauthenticateError('Authentication invalid')
  }
}

module.exports = auth