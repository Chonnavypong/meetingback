const express = require('express')

const equipController = require('./../controllers/equipController')
const authController = require('./../controllers/authController')

const router = express.Router()

router.route('/')
  .get(equipController.getAllEquip)
  // .post(authController.protect, authController.restricTo('admin'), equipController.creatEquip)
  .post(equipController.uploadEquipPhoto, equipController.resizeEquipPhoto, equipController.creatEquip)

router.route('/:id')
  .delete(equipController.deleteEquip)
  .patch(equipController.updateEquip)
  module.exports = router