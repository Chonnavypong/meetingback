const express = require('express')
const morgan = require('morgan')

const AppError = require('./../app/utils/appError');
const globalErrorHandler = require('./../app/controllers/errorController');

const usersRouter = require('../app/routes/usersRoutes')

const app = express()
const expressSession = require('express-session')

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// ตั้งค่า Session สำหรับระบบ
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}))

app.use(express.json())

// Route

app.use('/api/v1/users', usersRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
  })

app.use(globalErrorHandler)

module.exports = app