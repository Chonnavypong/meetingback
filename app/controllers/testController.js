const constants = require('./../utils/constants')

const fs  = require('fs')
const path = require('path')
const pdfPath = path.resolve(__dirname, './../../public/pdf')


exports.fileTest = (req, res, next) =>{
  console.log(path.resolve(__dirname,`./../../${constants.folder.pdf}`))
  console.log(fs.existsSync(path.resolve(__dirname,`./../../${constants.folder.pdf}`)))
  console.log(fs.existsSync(path.resolve(__dirname,`./../../${constants.folder.image}`)))
  if(!fs.existsSync(path.resolve(__dirname,`./../../${constants.folder.pdf}`))){
    // console.log('From If statement')
    fs.mkdirSync(pdfPath, { recursive: true })
  }
  // try {
  //   // console.log(req.params)
  //   // console.log(fs.existsSync(__dirname, './../img'))
  //   res.status(200).json({
  //     status: 'success',
  //     message: 'Test Route',
  //     pathResolve: path.resolve(__dirname,`./../../${constants.folder.pdf}`)
  //   })
  // } catch (error) {
  //   res.status(401).json({
  //     status: 'Fail',
  //     Message: error.message,
  //   })
  // }
  next()
} 
