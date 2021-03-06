const { StatusCodes } = require('http-status-codes')

const errorHandler = (err, req, res, next) => {

  const customError = {
    msg: err.message || 'something went wrong please try again later',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  }

  // Duplicate Email
  if (err.code == 11000) {
    customError.msg = `user already exists ${Object.keys(err.keyValue)}`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }
  // Required field Errors handling
  if (err.name == "ValidationError") {
    customError.msg = Object.values(err.errors).map(item => item.message).join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // Cast Error ie.. searching with addional or less value with _ID
  if (err.name == "CastError") {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandler
