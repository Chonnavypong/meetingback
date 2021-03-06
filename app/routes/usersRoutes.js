const express = require('express')

const usersController = require('./../controllers/usersController')
const authController = require('./../controllers/authController')

const router = express.Router()

// Signup - Register
router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.post('/logout',authController.logout)


router.route('/')
    .get( authController.protect, usersController.getAllUsers)

module.exports = router