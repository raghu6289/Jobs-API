require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// Error Handler
const notFound = require('./app/middleware/notFound')
const errorHandler = require('./app/middleware/errorHandler')
const authenticationUser = require('./app/middleware/auth')

//DB Connection
const mongoSetup = require('./app/database/connect')

// API Routers
const authRouter = require('./app/routes/authRoute')
const jobsRouter = require('./app/routes/jobsRoute')

// API Security packages
const helemt = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// Swagger for Documentation

const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./jobsApiDoc.yaml')


app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}));


app.use(express.json())
app.use(helemt())
app.use(cors())
app.use(xss())


app.get('/', (req, res) => {
  res.send('<h2>Welcome to Jobs API</h2> <a href = "/api-docs">Documentation </a>')
})

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// Route Middleware

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticationUser, jobsRouter)

// Error Middleware
app.use(notFound)
app.use(errorHandler)


const port = process.env.PORT || 5000

const start = async () => {
  try {
    await mongoSetup(process.env.CONN)
    app.listen(port, () => console.log(`server is running at port ${port}`))

  } catch (error) {
    console.log(error);
  }
}

start()