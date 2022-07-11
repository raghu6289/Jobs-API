const { StatusCodes } = require('http-status-codes')

class UnauthenticateError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

module.exports = UnauthenticateError