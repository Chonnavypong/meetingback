const Equip = require('./../models/equipmentsModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const sharp = require('sharp')

// WORK_FLOW:/* เอาไว้ตรวจสอบว่ามี directory ชื่อ อยู่หรือไม่มีให้ทำการสร้างใหม่ */

const {
  folder
} = require('./../utils/constants')
const fs = require('fs')
const path = require('path')

// Folder
const dirImage = path.resolve(__dirname, `./../../${folder.image}`)
const dirEquipImg = path.join(dirImage, folder.imageEquipment)

// multer-A. multer setting
const multer = require('multer')
// multer-B. multer storage setting
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb( null, 'public/img/equipment')
//   },
//   filename: (req, file, cb) => {
//     const originalName = file.originalname.split('.')[0]
//     const ext = file.mimetype.split('/')[1]
//     cb(null,`equip-${originalName}-${Date.now()}.${ext}`)
//   }
// })
const multerStorage = multer.memoryStorage()
// multer-C. multer filter setting
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! please upload only image.', 400), false)
  }
}
// multer-D. multer upload setting
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

// exports.uploadEquipPhoto = upload.single('photo') // Sigle Photo
exports.uploadEquipPhoto = upload.fields([{
    name: 'photoCover',
    maxCount: 1
  },
  {
    name: 'photo',
    maxCount: 3
  }
])

exports.resizeEquipPhoto = catchAsync(async (req, res, next) => {
  //TODO: Check logic ลองเปลี่ยนเป็น Switch Case
  console.log(' logic ',!req.files.photoCover, !req.files.photo)
  // console.log(!req.files.photoCover || !req.files.photo)

  if (!req.files.photoCover || !req.files.photo) return next()

  // // 1) Cover Photo
  const originalName = req.files.photoCover[0].originalname.split('.')[0]
  console.log(`original name : ${originalName}`)
  req.body.photoCover = `equipCover-${originalName}-${Date.now()}.jpeg`
  // console.log(req.files.photoCover)

  //---------------
  // Check Folder is exists or not, If there have no folder -> create folder
  if (!fs.existsSync(dirImage)) {
    console.log(!fs.existsSync(dirImage))
    fs.mkdirSync(dirImage, {
      recursive: true
    })
  }
  if (!fs.existsSync(dirEquipImg)) {
    fs.mkdirSync(dirEquipImg)
  }
  //---------------
  await sharp(req.files.photoCover[0].buffer)
    .resize(1500, 500)
    .toFormat('jpeg')
    .jpeg({
      quality: 90
    })
    .toFile(`${path.join(dirImage, folder.imageEquipment)}/${req.body.photoCover}`)

  // 2) Photo
  req.body.photos = []
  // console.log(req.body.photo)
  // console.log(req.files)
  await Promise.all(
    req.files.photo.map(async (file, i) => {
      const originalName = file.originalname.split('.')[0]
      const filename = `equip-${originalName}-${Date.now()}-${i+1}.jpeg`

      await sharp(file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({
          quality: 90
        })
        .toFile(`${path.join(dirImage, folder.imageEquipment)}/${filename}`)

      await req.body.photos.push(filename)
    })
  )

  // console.log(Array.isArray(req.body.photos))

  next()
})

exports.getAllEquip = catchAsync(async (req, res, next) => {
  const equip = await Equip.find().select(['-createdAt', '-updatedAt'])

  res.status(200).json({
    status: 'success',
    result: equip.length,
    // data: {
    //   equip
    // }
    equip
  })
})

exports.creatEquip = async (req, res, next) => {
  try {
    console.log('create-> ', req.body.name)
    const data = await Equip.create({
      name: req.body.name,
      detail: req.body.detail,
      photoCover: req.body.photoCover,
      photos: req.body.photos
    })
    res.status(200).json({
      status: 'success',
      result: data.length,
      doc: {
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

exports.deleteEquip = async (req, res, next) => {
  try {
    // console.log('id ' + req.params.id)
    const doc = await Equip.findByIdAndDelete(req.params.id)

    console.log(doc)
    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }
    // console.log('doc ' + doc)
    //---- delete photoCover & photos-----
    const delPhotoCover = path.join(dirEquipImg, doc.photoCover)

    // console.log( 'photoCover name ' + delPhotoCover )
    if (fs.existsSync(delPhotoCover)) fs.unlink(delPhotoCover, () => null) // () => null เนื่องจาก fs.unlink ต้องการ callback ถ้าไม่มีจะแสดง warnning ออกมา

    doc.photos.map((photo) => {
      // console.log('photo name ' + photo)
      const delPhoto = path.join(dirEquipImg, photo)
      if (fs.existsSync(delPhoto)) fs.unlink(delPhoto, () => null)

      // console.log('path photo ' + path.join(dirEquipImg, photo))
    })

    res.status(200).json({
      status: 'success',
    })

  } catch (err) {

    res.status(401).json({
      status: 'Fail',
      message: err.message

    })
  }
}

exports.updateEquip = async (req, res, next) => {
  try {
    await console.log(req.params, req.body.name)
    const doc = await Equip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    // console.log(doc)
    // ---- Update รูปภาพ ----
    console.log(req.body, req.files.photoCover)
    if (req.files.photoCover) {
      const deletePhotoCover = path.join(dirEquipImg, doc.photoCover)
      if (fs.existsSync(deletePhotoCover)) fs.unlink(deletePhotoCover, () => null)
      console.log('Old PhotoCover ' + deletePhotoCover)
      // fs.unlink( deletePhotoCover, () => null )
    }

    res.status(200).json({
      status: 'success',
      info: req.body

    })

  } catch (err) {

    res.status(401).json({
      status: 'Fail',
      message: err.message

    })
  }
}