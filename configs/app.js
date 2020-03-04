const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const AppError = require('../app/utils/appError');
const globalErrorHandler = require('../app/controllers/errorController');

const usersRouter = require('../app/routes/usersRoutes')
const equipRouter = require('../app/routes/equipRoutes')

const app = express()
const expressSession = require('express-session')

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors())
app.options('*', cors())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Setting Session
// app.use(expressSession({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {}
// }))

// Body parser, reading data from body into req.body
app.use(express.json({
    limit: '10kb'
}))
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true,
    limit: '10kb'
}))

//  การอ้างอิง จาก app.js ไปหา public folder -> ./../public
app.use(express.static(path.join(__dirname, './../public')))

// Test middleware
// app.use( (req, res, next ) => {
//     // console.log( req.cookies )
//     next()
// })

// Route
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/equips', equipRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app