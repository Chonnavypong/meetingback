const express = require('express')

const equipController = require('./../controllers/equipController')
const authController = require('./../controllers/authController')

const router = express.Router()

router.route('/')
  .get(authController.protect, equipController.getAllEquip)
  // .post(authController.protect, authController.restricTo('admin'), equipController.creatEquip)
  .post(equipController.uploadEquipPhoto, equipController.creatEquip)
module.exports = router