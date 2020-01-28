const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')

const AppError = require('./../app/utils/appError');
const globalErrorHandler = require('./../app/controllers/errorController');

const usersRouter = require('../app/routes/usersRoutes')

const app = express()
const expressSession = require('express-session')

// 1) GLOBAL MIDDLEWARES
// Implement CORS
// app.use(cors())
// app.options('*', cors())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Setting Session
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '10kb'
}))
app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
}))

// Route

app.use('/api/v1/users', usersRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app