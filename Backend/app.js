const express = require('express')

const mongoose = require('mongoose')
const cors = require('cors')
const session = require("cookie-session")
const dotenv = require('dotenv')
const path = require('path')
const helmet = require('helmet')
const hpp = require('hpp')
const csurf = require('csurf')
const passport = require('./middlewares/passport')
const predictionRoutes = require('./Routes/predictionRoutes')
const statusRoutes = require('./Routes/statusRoutes')
const performanceRoutes = require('./Routes/performanceRoutes')
const opportunityRoutes = require('./Routes/opportunityRoutes')
const authRoutes = require('./Routes/authRoutes')
// import config from .env

dotenv.config({ path: path.resolve(__dirname, '.env') })

const app = express()

mongoose.connect("mongodb+srv://IBMCapstone:IBMCapstoneAdmin@ibmcapstone.7naqx.mongodb.net/IBMCapstone?retryWrites=true&w=majority");
const db = mongoose.connection
db.on(
  'error',
  console.error.bind(console, 'connection error: Could not connect to MongoDB')
)

db.once('open', () => {
  console.log('Database connected')
})


app.use(helmet());
app.use(hpp());
app.use(
  session({
    name: "cookieSession",
    secret: process.env.COOKIE_SECRET,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: false
  })
)
app.use(passport.initialize())

app.use(csurf())

app.use(cors())


app.use('/auth', authRoutes)
app.use('/predictions', predictionRoutes)
app.use('/status', statusRoutes)
app.use('/performance', performanceRoutes)
app.use('/opportunities', opportunityRoutes)




app.listen('3001', (req, res) => {
  console.log('connected')
})

module.exports = app;