const Equip = require('./../models/equipmentsModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const sharp = require('sharp')

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
exports.uploadEquipPhoto = upload.fields([
  {name: 'photoCover', maxCount: 1},
  {name: 'photo', maxCount: 3}
])

exports.resizeEquipPhoto = catchAsync( async(req, res, next) => {
  // console.log(!req.files.photoCover)

  if (!req.files.photoCover || !req.files.photo) return next()
  
  // // 1) Cover Photo
  const originalName = req.files.photoCover[0].originalname.split('.')[0]
  // console.log(`original name : ${originalName}`)
  req.body.photoCover = `equip-${originalName}-${Date.now()}.jpeg`
  // console.log(req.files.photoCover)

  await sharp(req.files.photoCover[0].buffer)
    .resize(1500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/equipment/${req.body.photoCover}`)

  // 2) Photo
    req.body.photos = []
    // console.log(req.body.photo)
    // console.log(req.files)
    await Promise.all(
      req.files.photo.map( async (file, i) => {
        const originalName = file.originalname.split('.')[0]
        const filename = `equip-${originalName}-${Date.now()}-${i+1}.jpeg`

        await sharp( file.buffer )
          .resize(500, 500)
          .toFormat('jpeg')
          .jpeg( { quality: 90 })
          .toFile(`public/img/equipment/${filename}`)

        await req.body.photos.push(filename)
      })
    )

    console.log(Array.isArray(req.body.photos))

  next()
})
// exports.resizeTourImages = catchAsync(async (req, res, next) => {
//   if (!req.files.imageCover || !req.files.images) return next();

//   // 1) Cover image
//   req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
//   await sharp(req.files.imageCover[0].buffer)
//     .resize(2000, 1333)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/tours/${req.body.imageCover}`);

//   // 2) Images
//   req.body.images = [];

//   await Promise.all(
//     req.files.images.map(async (file, i) => {
//       const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

//       await sharp(file.buffer)
//         .resize(2000, 1333)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toFile(`public/img/tours/${filename}`);

//       req.body.images.push(filename);
//     })
//   );

//   next();
// });

exports.getAllEquip = catchAsync(async (req, res, next) => {
  const equip = await Equip.find().select(['-createdAt', '-updatedAt'])

  res.status(200).json({
    status: 'success',
    result: equip.length,
    data: {
      equip
    }
  })
})

exports.creatEquip = async (req, res, next) => {
  try {
    const data = await Equip.create(req.body)
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