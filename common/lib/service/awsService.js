const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3-v2')
const uid = require('uid')
const Exception = require('../utils/exception')
const config = require('../config')
const path = require('path')
const s3 = new AWS.S3({
  accessKeyId: config.AWS.accessKeyId,
  secretAccessKey: config.AWS.secretAccessKey,
  region: config.AWS.region
})


class AwsService {

  BASE = (folder) => {
    return {
      storage: multerS3({
        s3,
        bucket: config.AWS.buckect + '/' + folder,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname })
        },
        key: function (req, file, cb) {
          const extension = path.extname(file.originalname)
          console.log(file, extension)
          cb(null, uid(20) + extension)
        }
      }),
      // file limit is 300mb
      limits: { fileSize: 300000 * 10000 }
    }
  }

  mp4 = multer({
    ...this.BASE('videos'),
    fileFilter(req, file, cb) {
      // console.log(req,)
      if (
        !file.originalname.match(/\.(mp4)$/i)
      ) {
        return cb(new Exception('file must be in mp4 format'))
      } else cb(null, true)
    }
  })

  csv = multer({
    ...this.BASE('doc'),
    fileFilter(req, file, cb) {
      // console.log(req,)
      if (
        !file.originalname.match(/\.(csv)$/i)
      ) {
        return cb(new Exception('Please upload a csv file'))
      } else cb(null, true)
    }
  })

  image = (folder = 'images') => multer({
    ...this.BASE(folder),
    fileFilter(req, file, cb) {
      // console.log(req,)
      if (
        !file.originalname.match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)
      ) {
        return cb(new Exception('file must be an image'))
      } else cb(null, true)
    }
  })

  audio = multer({
    ...this.BASE('audio'),
    fileFilter(req, file, cb) {
      // console.log(req,)
      if (
        !file.originalname.match(/\.(mp3|wav|aif|mid)$/i)
      ) {
        return cb(new Exception('file must be an audio'))
      } else cb(null, true)
    }
  })

  deleteFile = async (params) => {

    try {
      await s3.headObject(params).promise()
      console.log("File Found in S3")
      try {
        await s3.deleteObject(params).promise()
        console.log("file deleted Successfully")
      }
      catch (err) {
        console.log("ERROR in file Deleting : " + JSON.stringify(err))
      }
    } catch (err) {
      console.log("File not Found ERROR : " + err.code)
    }

  }

  getSignedUrl = async (Key, signedUrlExpireSeconds = 60 * 5) =>
    await s3.getSignedUrl('getObject', {
      Bucket: config.AWS.buckect,
      Key,
      Expires: signedUrlExpireSeconds
    })
}

module.exports = new AwsService


// size: 3198061,
// bucket: 'easysax',
// key: 'aeaasnpauzhwmyqhozbs.png',
// acl: 'private',
// contentType: 'application/octet-stream',
// contentDisposition: null,
// storageClass: 'STANDARD',
// serverSideEncryption: null,
// metadata: { fieldName: 'video' },
// location: 'https://easysax.s3.ca-central-1.amazonaws.com/aeaasnpauzhwmyqhozbs.png',
// etag: '"64addcbda011c4a1fa3bd9e7eec9cacf"',
// versionId: 'ONvUPsNblWPFdXnW7ohUP33eX6Gb8oVI'
// },
