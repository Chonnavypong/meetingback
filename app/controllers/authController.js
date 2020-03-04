const {
  promisify
} = require('util')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')

const User = require('./../models/usersModel')

const signToken = id => {
  return jwt.sign({
    id
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  // Remove password from output
  user.password = undefined
  console.log(user)

  res.status(statusCode).json({
    status: 'success',
    token,
    doc: {
      user
    }
  })
}

exports.signup = catchAsync(async (req, res, next) => {

  const newUser = await User.create({
    // เพื่อป้องกันไม่ให้ User ใส่ role = admin ซึ่งจะทำให้เราสูญเสียความปลอดภัย เราจึงกำจัดข้อมูลที่เข้ามาด้วย key เท่านั้น (Admin เราสร้างแบบ manual ใน mongoDB)
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  createSendToken(newUser, 201, res)

})

exports.login = catchAsync(async (req, res, next) => {
  const {
    email,
    password
  } = req.body

  // console.log(req.body)

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({
    email
  }).select('+password');
  console.log(user)

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
})


exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token
  // check token จาก header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if ( req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    )
  }

  // 2) Verification token
  let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  // console.log(decoded)

  // 3) Check if user still exists
  let currentUser = await User.findById(decoded.id)
  // console.log(currentUser)
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist.', 401)
    )
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401))
  }
  // GRANT ACCESS TO PROTECTED ROUTE 
  req.user = currentUser
  res.locals.user = currentUser
  next()
})

exports.restricTo = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user)
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      )
    }
    next()
  }
}

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: 'success'
  });
};