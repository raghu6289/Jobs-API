require('dotenv/config')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide valid email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 3,
  },
})

// Mongoose middleware using this we can encryted password before save in the db.
// In mongoose 5.x, instead of calling next() manually, you can use a function that returns a promise. In particular, you can use async/await.

UserSchema.pre('save', async function () {
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
})

// Instances of Models are documents.Documents have many of their own built -in instance methods.We may also define our own custom document instance methods.

UserSchema.methods.genToken = function () {
  const user = this
  const payload = {
    userId: user._id,
    name: user.name
  }
  return jwt.sign(payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_Expires })
}

UserSchema.methods.findByCredentials = async function (Password) {
  const isMatch = await bcryptjs.compare(Password, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)