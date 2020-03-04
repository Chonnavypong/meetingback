const Users = require('../models/usersModel')
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const validator = require('validator')

exports.test = async (req, res, next) => {

    const testEmail = req.body.email
    
        const isUsername = validator.isEmpty(req.body.userName)
        const isPass = validator.isEmpty(req.body.password)
        const checkValidate = validator.isEmail(testEmail)
        console.log(`User Name : ${isUsername}`, `Password ${isPass}`)
   


        console.log(checkValidate)
    // try{
    //     const user = req.body
    //     res.status(200).json({
    //         status: 'success',
    //         result: user.length,
    //         data: {
    //             message: 'Login page'
    //         }
    //     })
    // } catch (err) {
    //     res.status(401).json({
    //         status: 'Fail'
    //     })
    // }
    next()
}

exports.getAllUsers = catchAsync(async (req, res, next) => {  
    const users = await Users.find().select(['-createdAt', '-updatedAt'])
  
    res.status(200).json({
        status: 'success',
        result: users.length,
        doc: {
            users
        }
    })
})

exports.creatUser = async (req, res, next) => {
    try {
        const data = await Users.create({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        })
        res.status(200).json({
            status: 'success',
            result: data.length,
            data: {
                data
            }
        })
    } catch (err) {
        res.status(401).json({
            status: 'Fail',
            message: err.message
        })
    }
}