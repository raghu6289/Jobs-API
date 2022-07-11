const mongoose = require('mongoose')

const mongoSetup = (url) => {
  return mongoose.connect(url, {
  })
    .then(() => { console.log('Database connected..') })
    .catch(() => console.log("Database failed to connect"))
}


module.exports = mongoSetup