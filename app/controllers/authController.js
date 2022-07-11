const User = require('../models/UserSchema')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticateError } = require('../errors')

const register = async (req, res) => {
  /*const { name, email, password } = req.body
  const salt = await bcryptjs.genSalt(10)
  const hashPassword = await bcryptjs.hash(password, salt)
  const register = {
    name, email,
    password: hashPassword
  }*/

  const user = await User.create({ ...req.body })
  const token = user.genToken()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {

  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('invalid credentials')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new UnauthenticateError('invalid credentials')
  }

  const isCorrect = await user.findByCredentials(password)

  if (!isCorrect) {
    throw new UnauthenticateError('invalid credentials')
  }
  const token = user.genToken()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

module.exports = {
  register,
  login
}