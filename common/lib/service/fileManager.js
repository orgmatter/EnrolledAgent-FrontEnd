const multer = require('multer')
const uid = require('uid')
const del = require('del')
// const imghash = require('imghash')
// const blurHash = require('blurhash')
const Exception = require('../utils/exception')
const fs = require('fs-extra')
const path = require('path')
const config = require('../config')
const Storage = require('../utils/storage')
const Logger = require('../utils/logger')

const tempDir = '/tmp'
const log = new Logger('fileManager')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir)
  },
  filename: function (req, file, cb) {
    cb(null, uid(15))
  }
})

const uploader = multer({
  storage,
  // file mimit is 1mb
  limits: { fileSize: 1024 * 1024 },

  fileFilter(req, file, cb) {
    // console.log(req,)
    if (
      !file.originalname.match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)
    ) {
      return cb(new Exception('file must be an image'))
    } else cb(null, true)
  }
})


const uploader2 = multer({
  storage,
  // file mimit is 2mb
  limits: { fileSize: 1024 * 1024 * 2 },

  // fileFilter(req, file, cb) {
  //   // console.log(req,)
  //   if (
  //     !file.originalname.match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)
  //   ) {
  //     return cb(new Exception('file must be an image'))
  //   } else cb(null, true)
  // }
})

/**
 * deletes a file given the file path
 * @param  {string} file - the file path to delete
 */
exports.deleteFile = async function (file) {
  log.info(file)
  if (file != null && file !== '') {
    const f = path.join(config.STORAGE, file)
    if (f == config.STORAGE) return null
    const deletedPaths = await del([f], { force: true })
    log.info(`${f} file deleted succesfully ${deletedPaths}`)
  }
}

generateHash = async function (file) {
  log.info(file)
  if (file != null && file !== '') {
    // const f = path.join(config.STORAGE, file)
    // if (f == config.STORAGE) return null
    // imghash.hash(file, 8).then((hash) => {
    //   console.log(hash) // 'f884c4d8d1193c07'
    //   log.info('created hash')
    // // })
    // const f = await fs.readFileSync(file, null)
    //   // .then((fi) => console.log(fi))
    // console.log(f.writeUInt8)
    // const a = await blurHash.encode(f, 512, 512,)
    // console.log(a)
  }
}

/**
 * upload a single file to the server and save to temp directory
 */
exports.upload = uploader.single('avatar')
exports.any = uploader.any()
exports.array = uploader.array('avatar[]')
exports.fields = uploader2.fields([
  { name: 'certificate', maxCount: 1 },
  { name: 'director_id', maxCount: 1 },
  { name: 'company_address_proof', maxCount: 1 },
  { name: 'director_address_proof', maxCount: 1 }
])

/**
 * folder to save the file
 * @param  {string} folder
 * @param  {File} file
 */
exports.saveFile = async function (folder = Storage.PROFILE, file) {
  if (!file) return null
  const { originalname, filename } = file
  const extension = path.extname(originalname)
  const name = `${filename}${extension}`
  const storagePath = path.join(config.STORAGE, folder, name)
  return await new Promise((resolve, reject) => {
    fs.move(file.path, storagePath, (err) => {
      if (err) {
        return resolve(
          new Exception(
            'An unexpected error occured could not upload this file'
            // ErrorCodes.
          )
        )
      }

      const imageUrl = `/${folder}/${name}`
      console.log('file manager', imageUrl, storagePath)
      resolve(imageUrl)
      // generateHash(storagePath)
    })
  })
}
